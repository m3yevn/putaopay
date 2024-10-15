import { configDotenv } from "dotenv";
import braintreeService from "../../../services/braintreeService";
import { nonPaypalPayload } from "../data";
import { beforeAll, jest } from "@jest/globals";

describe("Braintree service", () => {
  console.error = jest.fn();

  it("should not create transactions without setting .env config", async () => {
    const { price, currency, ...creditCard } = nonPaypalPayload;
    try {
      await braintreeService.createTransaction(price, currency, creditCard);
    } catch (ex) {
      expect(ex).toStrictEqual({
        message: "Processing payment is failed in authentication.",
        status: 500,
        title: "SERVICE ERROR",
      });
    }
  });

  describe("Braintree service with config", () => {
    beforeAll(() => {
      configDotenv();
      braintreeService.createGateway();
    });

    it("should create transactions ", async () => {
      const { price, currency, ...creditCard } = nonPaypalPayload;

      const result = await braintreeService.createTransaction(
        price,
        currency,
        creditCard
      );
      expect(result.success).toBe(true);
    });
  });
});
