import { createApp, reactive } from "https://unpkg.com/petite-vue?module";

const CARD_TYPES = ["AMEX", "MASTER", "VISA"];
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

export const store = reactive({
  currencies: CURRENCIES,
  cardTypes: CARD_TYPES,
  isLoading: false,
  toast: {
    header: "",
    info: "",
    body: "",
  },
  form: {
    price: "",
    name: "",
    currency: "USD",
    cardHolder: "",
    cardNumber: "",
    cardType: "",
    cardExpiry: "",
    cardCVV: "",
    isValid: true,
  },
  get $formatters() {
    return {
      cardNumber:
        this.form.cardType === "AMEX"
          ? this.form.cardNumber.length === 17
          : this.form.cardNumber.length === 19,
      cardExpiry: this.form.cardExpiry.length === 7,
      cardCVV: this.form.cardCVV.length === 3,
    };
  },
  get $validations() {
    return {
      price:
        !this.form.price && !this.form.isValid
          ? "form-control is-invalid"
          : "form-control",
      name:
        !this.form.name && !this.form.isValid
          ? "form-control is-invalid"
          : "form-control",
      cardHolder:
        !this.form.cardHolder && !this.form.isValid
          ? "form-control is-invalid"
          : "form-control",
      cardNumber:
        !this.form.isValid && !this.$formatters.cardNumber
          ? "form-control is-invalid"
          : "form-control",
      cardExpiry:
        !this.form.isValid && !this.$formatters.cardExpiry
          ? "form-control is-invalid"
          : "form-control",
      cardCVV:
        !this.form.isValid && !this.$formatters.cardCVV
          ? "form-control is-invalid"
          : "form-control",
    };
  },
  get formCurrency() {
    const currencyObj = this.currencies.find(
      (currency) => currency.value === this.form.currency
    );
    return currencyObj;
  },
  handleCardCVVChange(event) {
    const isNumber = checkDigit(event);
    if (!isNumber) {
      event.preventDefault();
    } else {
      this.form.cardCVV = event.target.value;
    }
  },
  handleExpiryDateChange(event) {
    const isNumber = checkDigit(event);
    if (!isNumber) {
      event.preventDefault();
    } else {
      const value = event.target.value.replace(" / ", "");
      const formatted = formatExpiryDate(value);
      this.form.cardExpiry = formatted;
    }
  },
  handleCardNumberChange(event) {
    const isNumber = checkDigit(event);
    if (!isNumber) {
      event.preventDefault();
    } else {
      const value = event.target.value.replace(/\s/g, "");
      if (event.key === "Backspace") {
        this.form.cardNumber = event.target.value;
      } else {
        const { formatted, type } = formatCardNumber(value);
        this.form.cardNumber = formatted;
        this.form.cardType = type;
      }
      if (value.length < 2) {
        this.form.cardType = "";
      }
    }
  },
  handleCurrencyChange(event) {
    this.form.currency = event.target.value;
  },
  handleCloseToast() {
    this.$refs.toastRef.classList.remove("show");
    this.store.toast = {
      header: "",
      info: "",
      body: "",
    };
  },
});

export function Form(props) {
  return {
    $template: "#form-template",
    store,
    async handleSubmitForm() {
      try {
        this.store.isLoading = true;
        const isValid = this.$refs.formRef.checkValidity();
        const hasFormatIssues = Object.values(this.store.$formatters).some(
          (value) => value === false
        );
        this.store.form.isValid = isValid && !hasFormatIssues;
        if (this.store.form.cardType === "Invalid") {
          return;
        }
        if (!this.store.form.isValid) {
          return;
        }
        const result = await fetch("/api/healthcheck");
        const response = await result.json();
        this.store.toast = {
          header: "Result",
          info: new Date().toLocaleTimeString(),
          body: response.message,
        };
        this.$refs.toastRef.classList.add("show");
      } catch (ex) {
        console.error(ex);
      } finally {
        this.store.isLoading = false;
      }
    },
  };
}

export function checkDigit(event) {
  const code = event.which ? event.which : event.keyCode;
  if (event.ctrlKey) {
    return true;
  }

  if (code >= 96 && code <= 105) {
    return true;
  } else if ((code < 48 || code > 57) && code > 31) {
    return false;
  }

  return true;
}

createApp({ Form }).mount();
