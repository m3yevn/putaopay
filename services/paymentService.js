const { amexValidator } = require("../helpers/validators");
const braintreeService = require("./braintreeService");
const paypalService = require("./paypalService");

const PAYPAL_CURRENCIES = ["USD", "EUR", "AUD"];

class CorePaymentService {
  constructor(props) {}

  getPaymentService(currency, type) {
    if (type === "AMEX" || PAYPAL_CURRENCIES.includes(currency)) {
      console.log("Using Paypal service for transaction.");
      return paypalService.createOrder;
    }
    console.log("Using Braintree service for transaction.");
    return braintreeService.createTransaction;
  }

  async makePayment({ name, price, creditCard }) {
    const { cardType, currency } = creditCard;
    amexValidator(currency, cardType);
    const serviceHandler = this.getPaymentService(currency, cardType);
    await serviceHandler(creditCard);
    return "";
  }
}

module.exports = new CorePaymentService();
