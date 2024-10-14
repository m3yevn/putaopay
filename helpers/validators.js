import {
  REQUIRED_FIELDS_PAYMENT,
  CARD_TYPE_LENGTH,
} from "../constants/index.js";

export const paymentParamsValidator = (req, res, next) => {
  const missingFields = REQUIRED_FIELDS_PAYMENT.filter(
    (field) => !Object.keys(req.body).includes(field)
  );
  if (!!missingFields.length) {
    throw {
      status: 400,
      title: "BAD REQUEST",
      message: `These fields are missing in body. ${missingFields}`,
    };
  }
  next();
};

export const paymentFormatValidator = (req, res, next) => {
  const { cardType, cardNumber } = req.body;
  const cleanCardNumber = cardNumber.replace(/\s/g, "");
  const lengthOfType = CARD_TYPE_LENGTH[cardType];
  if (cleanCardNumber.toString().length !== lengthOfType.length) {
    throw {
      status: 406,
      title: "NOT ACCEPTABLE",
      message: lengthOfType.message,
    };
  }
  req.body.cardNumber = parseInt(cleanCardNumber);
  next();
};

export const amexValidator = (currency, type) => {
  if (currency !== "USD" && type === "AMEX") {
    throw {
      status: 406,
      title: "NOT ACCEPTABLE",
      message: `Unable to use AMEX card with non-USD currency.`,
    };
  }
};
