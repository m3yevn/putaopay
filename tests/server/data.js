export const validAmexPayload = {
  name: "Kevin",
  price: "1",
  currency: "USD",
  cardType: "AMEX",
  cardHolder: "Moe Myint Myat",
  cardNumber: 371449635398431,
  cardExpiry: "11 / 26",
  cardCVV: 5521,
};

export const invalidAmexCurrencyPayload = {
  name: "Kevin",
  price: "1",
  currency: "SGD",
  cardType: "AMEX",
  cardHolder: "Moe Myint Myat",
  cardNumber: 222300004840001,
  cardExpiry: "11 / 26",
  cardCVV: 552,
};

export const invalidAmexCVVPayload = {
  name: "Kevin",
  price: "1",
  currency: "USD",
  cardType: "AMEX",
  cardHolder: "Moe Myint Myat",
  cardNumber: 222300004840001,
  cardExpiry: "11 / 26",
  cardCVV: 55, //should have 3 or 4
};

export const invalidCardNumberLengthPayload = {
  name: "Kevin",
  price: "1",
  currency: "THB",
  cardType: "MASTER",
  cardHolder: "Moe Myint Myat",
  cardNumber: 222300004,
  cardExpiry: "11 / 26",
  cardCVV: 552,
};

export const nonPaypalPayload = {
  name: "Kevin",
  price: "1",
  currency: "THB",
  cardType: "VISA",
  cardHolder: "Moe Myint Myat",
  cardNumber: 4111111111111111,
  cardExpiry: "11 / 26",
  cardCVV: 552,
};
