const request = require("supertest");
const { startServer } = require("../../server");
const { configDotenv } = require("dotenv");

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

  it("should establish services successfully", async () => {
    expect(console.log.mock.calls[0]).toStrictEqual(["Database connection is established."], ["Paypal API configs are established."], ["Braintree Gateway is established."]);
  });

  it("should serve the HTML page in public", async () => {
    const res = await request(app)
      .get("/")
      .expect("Content-Type", "text/html; charset=UTF-8")
      .expect(200);
  });

  it("should be healthy", async () => {
    const res = await request(app).get("/api/healthcheck");
    expect(res.body.message).toBe("API is healthy");
  });
});
