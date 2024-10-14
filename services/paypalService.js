class PaypalService {
  constructor(props) {}

  createConfig() {
    this.apiUrl = process.env.PAYPAL_API_URL;
    this.authUrl = process.env.PAYPAL_AUTH_URL;
    this.paypalCredentials = process.env.PAYPAL_CREDENTIALS;
    console.log("Paypal API configs are established.");
  }

  async createToken() {
    try {
      const result = await fetch(this.authUrl, {
        method: "POST",
        headers: {
          Authorization: `Basic ${this.paypalCredentials}`,
        },
        body: {
          grant_type: "client_credentials",
        },
      });
      const response = await result.json();
      return `${response.token_type} ${response.access_token}`;
    } catch (ex) {
      console.error(ex);
    }
  }

  async createOrder() {}
}

module.exports = new PaypalService();
