import { v4 } from "uuid";
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
          Authorization: `Basic ${btoa(this.paypalCredentials)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }),
      });
      const response = await result.json();
      if (response.access_token) {
        return `${response.token_type} ${response.access_token}`;
      }
      return "";
    } catch (ex) {
      console.error(ex);
    }
  }

  formatExpiry(date) {
    const [month, year] = date.split(" / ");
    return `20${year}-${month}`;
  }

  async createOrder(price, currency, card) {
    console.debug("Start to trigger the Paypal API.");
    try {
      const accessToken = await this.createToken();
      if (!accessToken) {
        throw new Error("Processing payment is failed in authentication.");
      }
      const payload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: v4(),
            amount: {
              currency_code: currency,
              value: price,
            },
          },
        ],
        payment_source: {
          card: {
            name: card?.cardHolder,
            number: card?.cardNumber,
            security_code: card?.cardCVV,
            expiry: this.formatExpiry(card?.cardExpiry),
          },
        },
      };
      const result = await fetch(`${this.apiUrl}/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
          "Paypal-Request-Id": v4(),
        },
        body: JSON.stringify(payload),
      });
      const response = await result.json();
      if (response.status === "COMPLETED") {
        return response;
      }
      throw new Error("Processing payment is failed.");
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

export default new PaypalService();
