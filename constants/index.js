const REQUIRED_FIELDS_PAYMENT = [
  "name",
  "price",
  "currency",
  "cardHolder",
  "cardNumber",
  "cardType",
  "cardExpiry",
  "cardCVV",
];

const CARD_TYPE_LENGTH = {
  AMEX: {
    length: 15,
    message: "AMEX card should be 15 numbers",
  },
  MASTER: {
    length: 16,
    message: "MASTER card should be 16 numbers",
  },
  VISA: {
    length: 16,
    message: "VISA card should be 16 numbers",
  },
};

const PAYPAL_CURRENCIES = ["USD", "EUR", "AUD"];

module.exports = {
  REQUIRED_FIELDS_PAYMENT,
  CARD_TYPE_LENGTH,
  PAYPAL_CURRENCIES,
};
