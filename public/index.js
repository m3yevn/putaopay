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

export function formatExpiryDate(value) {
  return value
    .replace(
      /[^0-9]/g,
      "" // To allow only numbers
    )
    .replace(
      /^([2-9])$/g,
      "0$1" // To handle 3 > 03
    )
    .replace(
      /^(1{1})([3-9]{1})$/g,
      "0$1/$2" // 13 > 01/3
    )
    .replace(
      /^0{1,}/g,
      "0" // To handle 00 > 0
    )
    .replace(
      /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g,
      "$1 / $2" // To handle 113 > 11/3
    );
}

export function formatCardNumber(value) {
  const ccNumString = value.replace(/[^0-9]/g, "");
  // mc, starts with - 51 to 55
  // v, starts with - 4
  // dsc, starts with 6011, 622126-622925, 644-649, 65
  // amex, starts with 34 or 37
  let typeCheck = ccNumString.substring(0, 2);
  let cType = "";
  let block1 = "";
  let block2 = "";
  let block3 = "";
  let block4 = "";
  let formatted = "";

  if (typeCheck.length == 2) {
    typeCheck = parseInt(typeCheck);
    if (typeCheck >= 40 && typeCheck <= 49) {
      cType = "VISA";
    } else if (typeCheck >= 51 && typeCheck <= 55) {
      cType = "MASTER";
    } else if (typeCheck == 34 || typeCheck == 37) {
      cType = "AMEX";
    } else {
      cType = "Invalid";
    }
  }

  // all support card types have a 4 digit firt block
  block1 = ccNumString.substring(0, 4);
  if (block1.length == 4) {
    block1 = block1 + " ";
  }

  if (cType === "VISA" || cType === "MASTER") {
    // for 4X4 cards
    block2 = ccNumString.substring(4, 8);
    if (block2.length === 4) {
      block2 = block2 + " ";
    }
    block3 = ccNumString.substring(8, 12);
    if (block3.length === 4) {
      block3 = block3 + " ";
    }
    block4 = ccNumString.substring(12, 16);
  } else if (cType === "AMEX") {
    // for Amex cards
    block2 = ccNumString.substring(4, 10);
    if (block2.length === 6) {
      block2 = block2 + " ";
    }
    block3 = ccNumString.substring(10, 15);
    block4 = "";
  } else if (cType === "Invalid") {
    // for Amex cards
    block1 = typeCheck;
    block2 = "";
    block3 = "";
    block4 = "";
    console.error("Invalid Card Number");
  }

  formatted = block1 + block2 + block3 + block4;
  return { formatted, type: cType };
}

createApp({ Form }).mount();
