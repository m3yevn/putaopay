import request from "supertest";
import { startServer } from "../../server.js";
import { configDotenv } from "dotenv";
import { CARD_TYPE_LENGTH } from "../../constants";
import paypalService from "../../services/paypalService.js";
import braintreeService from "../../services/braintreeService.js";
import { jest } from "@jest/globals";

const validAmexPayload = {
  name: "Kevin",
  price: "1",
  currency: "USD",
  cardType: "AMEX",
  cardHolder: "Moe Myint Myat",
  cardNumber: 222300004840001,
  cardExpiry: "11 / 26",
  cardCVV: 552,
};

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

const nonPaypalPayload = {
  name: "Kevin",
  price: "1",
  currency: "THB",
  cardType: "VISA",
  cardHolder: "Moe Myint Myat",
  cardNumber: 2223000048400011,
  cardExpiry: "11 / 26",
  cardCVV: 552,
};

describe("GET / and GET /api/healthcheck", () => {
  let httpServer;
  let app;
  console.log = jest.fn();
  console.error = jest.fn();
  jest.spyOn(paypalService, "createOrder").mockReturnValue("");
  jest.spyOn(braintreeService, "createTransaction").mockReturnValue("");

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

  it("should select Paypal service for AMEX card type", async () => {
    await request(app).post("/api/payment").send(validAmexPayload);
    const mockCalls = console.log.mock.calls;
    expect(
      mockCalls.slice(mockCalls.length - 1, mockCalls.length)[0]
    ).toContain("Using Paypal service for transaction.");
  });

  it("should select Braintree service for non-AMEX and non-Paypal currencies", async () => {
    await request(app).post("/api/payment").send(nonPaypalPayload);
    const mockCalls = console.log.mock.calls;
    expect(
      mockCalls.slice(mockCalls.length - 1, mockCalls.length)[0]
    ).toContain("Using Braintree service for transaction.");
  });
});
