import { formatCardNumber, formatExpiryDate } from "../../public/modules/formatters";

it("should format expiry date text to required format", () => {
  const result = formatExpiryDate("0126");
  expect(result).toBe("01 / 26");
});

it("should format expiry date text to required format if more than 12 months", () => {
  const result = formatExpiryDate("14");
  expect(result).toBe("01 / 4");
});

//sample from https://www.paypalobjects.com/en_GB/vhelp/paypalmanager_help/credit_card_numbers.htm
const amexCard = "378282246310005";
const masterCard = "5105105105105100";
const visaCard = "4012888888881881";
const invalidCard = "5648694786418"

describe("Card Number Formatting and Card Type checking", () => {
  let amexResult;
  let masterResult;
  let visaResult;
  let invalidResult;
  beforeAll(() => {
    amexResult = formatCardNumber(amexCard);
    masterResult = formatCardNumber(masterCard);
    visaResult = formatCardNumber(visaCard);
  });

  it("should format card number to required format", () => {
    expect(amexResult.formatted).toBe("3782 822463 10005");
    expect(masterResult.formatted).toBe("5105 1051 0510 5100");
    expect(visaResult.formatted).toBe("4012 8888 8888 1881");
  });

  it("should give correct card types", () => {
    expect(amexResult.type).toBe("AMEX");
    expect(masterResult.type).toBe("MASTER");
    expect(visaResult.type).toBe("VISA");
  });

  it("should validate invalid card and stop input", () => {
    invalidResult = formatCardNumber(invalidCard);
    expect(invalidResult.type).toBe("Invalid");
    expect(invalidResult.formatted).toBe("56");
  })
});
