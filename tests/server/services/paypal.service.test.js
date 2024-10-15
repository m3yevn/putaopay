import { configDotenv } from "dotenv";
import paypalService from "../../../services/paypalService";
import { invalidAmexCVVPayload, validAmexPayload } from "../data";
import { jest } from "@jest/globals";

describe("Paypal service", () => {
  console.error = jest.fn();
  it("should not create access token without setting .env configs", async () => {
    const accessToken = await paypalService.createToken();
    expect(accessToken).toBe(undefined);
  });

  it("should not trigger paypal API without setting .env configs", async () => {
    const { price, currency, ...creditCard } = validAmexPayload;
    try {
      await paypalService.createOrder(price, currency, creditCard);
    } catch (ex) {
      expect(ex).toStrictEqual({
        message: "Processing payment is failed in authentication.",
        status: 500,
        title: "SERVICE ERROR",
      });
    }
  });

  describe("Paypal service with config", () => {
    beforeAll(() => {
      configDotenv();
      paypalService.createConfig();
    });

    it("should create access token", async () => {
      const accessToken = await paypalService.createToken();
      expect(accessToken).not.toBe(undefined);
      expect(accessToken).toContain("Bearer");
    });

    it("should trigger paypal API", async () => {
      const { price, currency, ...creditCard } = validAmexPayload;

      const result = await paypalService.createOrder(
        price,
        currency,
        creditCard
      );
      expect(result.status).toBe("COMPLETED");
    }, 30000);

    it("should trigger paypal API error if invalid", async () => {
      const { price, currency, ...creditCard } = invalidAmexCVVPayload;
      try {
        await paypalService.createOrder(price, currency, creditCard);
      } catch (ex) {
        expect(ex).toStrictEqual({
          message: "Request is not well-formed, syntactically incorrect, or violates schema.",
          status: 500,
          title: "SERVICE ERROR",
        });
      }
    }, 30000);
  });
});
