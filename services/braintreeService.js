import braintree from "braintree";
import { v4 } from "uuid";

class BraintreeService {
  constructor(props) {}

  createGateway() {
    try {
      this.braintreeCredentials = JSON.parse(process.env.BRAINTREE_CREDENTIALS);
      this.gateway = new braintree.BraintreeGateway({
        environment: braintree.Environment.Sandbox,
        ...this.braintreeCredentials,
      });
      console.log("Braintree Gateway is established.");
    } catch (ex) {
      throw new Error(ex);
    }
  }

  formatExpiry(date) {
    const [month, year] = date.split(" / ");
    return `${month}/${year}`;
  }

  async createTransaction(price, currency, card) {
    console.debug("Start to trigger the Braintree Gateway.");
    try {
      if (!this.gateway) {
        throw new Error("Processing payment is failed in authentication.");
      }
      const response = await this.gateway?.transaction?.sale({
        amount: price,
        creditCard: {
          number: card.cardNumber,
          expirationDate: this.formatExpiry(card.cardExpiry),
          cvv: card.cardCVV,
        },
      });
      if (response.success) {
        return {
          referenceId: v4(),
          externalId: response?.transaction?.id,
          payVia: "Braintree",
          serviceResponse: response,
          amount: `${response.transaction?.currencyIsoCode} ${response.transaction?.amount}`
        };
      } else {
        throw new Error(response.message);
      }
    } catch (ex) {
      console.error(ex);
      throw {
        status: 500,
        title: "SERVICE ERROR",
        message: ex.message,
      };
    }
  }
}

export default new BraintreeService();
