const braintree = require("braintree");

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

  async createTransaction() {}
}

module.exports = new BraintreeService();
