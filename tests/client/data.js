export const validForm = {
  price: 1,
  name: "Kevin",
  currency: "USD",
  cardHolder: "Moe Myint Myat",
  cardNumber: "4111 1111 1111 1111",
  cardType: "VISA",
  cardExpiry: "11 / 26",
  cardCVV: "879",
};

export const invalidNumberLengthForm = {
  price: 1,
  name: "Kevin",
  currency: "USD",
  cardHolder: "Moe Myint Myat",
  cardNumber: "4111 1111 1111",
  cardType: "VISA",
  cardExpiry: "11 / 26",
  cardCVV: "879",
};

export const invalidExpiryForm = {
  price: 1,
  name: "Kevin",
  currency: "USD",
  cardHolder: "Moe Myint Myat",
  cardNumber: "4111 1111 1111 1111",
  cardType: "VISA",
  cardExpiry: "11 / ",
  cardCVV: "879",
};

export const invalidCvvForm = {
  price: 1,
  name: "Kevin",
  currency: "USD",
  cardHolder: "Moe Myint Myat",
  cardNumber: "4111 1111 1111 1111",
  cardType: "VISA",
  cardExpiry: "11 / 26",
  cardCVV: "8",
};
