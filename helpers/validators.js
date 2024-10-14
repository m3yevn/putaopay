const { REQUIRED_FIELDS_PAYMENT, CARD_TYPE_LENGTH } = require("../constants");

const paymentParamsValidator = (req, res, next) => {
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

const paymentFormatValidator = (req, res, next) => {
  const { cardType, cardNumber } = req.body;
  const lengthOfType = CARD_TYPE_LENGTH[cardType];
  if (cardNumber.toString().length !== lengthOfType.length) {
    throw {
      status: 406,
      title: "NOT ACCEPTABLE",
      message: lengthOfType.message,
    };
  }
  next();
};

const amexValidator = (currency, type) => {
  if (currency !== "USD" && type === "AMEX") {
    throw {
      status: 406,
      title: "NOT ACCEPTABLE",
      message: `Unable to use AMEX card with non-USD currency.`,
    };
  }
};

module.exports = {
  paymentParamsValidator,
  amexValidator,
  paymentFormatValidator,
};
