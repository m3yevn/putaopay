import { createApp, reactive } from "https://unpkg.com/petite-vue?module";

const CURRENCIES = [
  {
    code: "us",
    value: "USD",
  },
  {
    code: "eu",
    value: "EUR",
  },
  {
    code: "th",
    value: "THB",
  },
  {
    code: "hk",
    value: "HKD",
  },
  {
    code: "sg",
    value: "SGD",
  },
  {
    code: "au",
    value: "AUD",
  },
];

const store = reactive({
  currencies: CURRENCIES,
  form: {
    currency: "USD",
  },
  get formCurrency() {
    const currencyObj = this.currencies.find(
      (currency) => currency.value === this.form.currency
    );
    return currencyObj;
  },
  handleCurrencyChange(event) {
    this.form.currency = event.target.value;
  },
});

function Form(props) {
  return {
    $template: "#form-template",
    store,
  };
}

createApp({ Form }).mount();
