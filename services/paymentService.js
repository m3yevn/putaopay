import { PAYPAL_CURRENCIES } from "../constants/index.js";
import { amexValidator } from "../helpers/validators.js";
import braintreeService from "./braintreeService.js";
import paypalService from "./paypalService.js";

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
    await serviceHandler(price, creditCard);
    return "";
  }
}

export default new CorePaymentService();
