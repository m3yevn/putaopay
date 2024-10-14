const request = require("supertest");
const { startServer } = require("../../server");
const { configDotenv } = require("dotenv");
const { CARD_TYPE_LENGTH } = require("../../helpers/validators");

const invalidAmexPayload = {
  name: "Kevin",
  price: "1",
  currency: "SGD",
  cardType: "AMEX",
  cardHolder: "Moe Myint Myat",
  cardNumber: 222300004840001,
  cardExpiry: "11 / 26",
  cardCVV: 552,
};

const invalidCardNumberLengthPayload = {
  name: "Kevin",
  price: "1",
  currency: "THB",
  cardType: "MASTER",
  cardHolder: "Moe Myint Myat",
  cardNumber: 222300004,
  cardExpiry: "11 / 26",
  cardCVV: 552,
};

describe("GET / and GET /api/healthcheck", () => {
  let httpServer;
  let app;
  console.log = jest.fn();

  beforeAll(() => {
    configDotenv();
    const server = startServer({ port: 9000 });
    httpServer = server.httpServer;
    app = server.app;
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500));
    httpServer.close();
  });

  it("should validate required parameters to make payment", async () => {
    await request(app).post("/api/payment").expect(400).expect({
      error: "BAD REQUEST",
      message:
        "These fields are missing in body. name,price,currency,cardHolder,cardNumber,cardType,cardExpiry,cardCVV",
    });
  });

  it("should validate invalid length for respective card type", async () => {
    const validator = CARD_TYPE_LENGTH[invalidCardNumberLengthPayload.cardType];
    await request(app)
      .post("/api/payment")
      .send(invalidCardNumberLengthPayload)
      .expect(406)
      .expect({
        error: "NOT ACCEPTABLE",
        message: validator.message,
      });
  });

  it("should validate using AMEX card with non-USD currency", async () => {
    await request(app)
      .post("/api/payment")
      .send(invalidAmexPayload)
      .expect(406)
      .expect({
        success: false,
        error: "NOT ACCEPTABLE",
        message: `Unable to use AMEX card with non-USD currency.`,
      });
  });
});
