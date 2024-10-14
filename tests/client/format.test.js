import { formatExpiryDate } from "../../public/formatters";

it("should format expiry date text to required format", () => {
  const result = formatExpiryDate("0126");
  expect(result).toBe("01 / 26");
});

it("should format expiry date text to required format if more than 12 months", () => {
  const result = formatExpiryDate("14");
  expect(result).toBe("01 / 4");
});
