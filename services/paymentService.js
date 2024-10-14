import { PAYPAL_CURRENCIES } from "../constants/index.js";
import { amexValidator } from "../helpers/validators.js";
import braintreeService from "./braintreeService.js";
import paypalService from "./paypalService.js";

class CorePaymentService {
  constructor(props) {}

  getPaymentService(currency, type) {
    if (type === "AMEX" || PAYPAL_CURRENCIES.includes(currency)) {
      console.log("Using Paypal service for transaction.");
      return paypalService.createOrder.bind(paypalService);
    }
    console.log("Using Braintree service for transaction.");
    return braintreeService.createTransaction.bind(braintreeService);
  }

  async makePayment({ name, price, currency, creditCard }) {
    const { cardType } = creditCard;
    amexValidator(currency, cardType);
    const serviceHandler = this.getPaymentService(currency, cardType);
    const result = await serviceHandler(price, currency, creditCard);
    return result;
  }
}

export default new CorePaymentService();
