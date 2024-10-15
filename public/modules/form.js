export default {
  async handleSubmitForm() {
    try {
      this.store.isLoading = true;
      const isValid = this.$refs.formRef.checkValidity();
      const hasFormatIssues = Object.values(this.store.$formatters).some(
        (value) => value === false
      );
      this.store.form.isValid = isValid && !hasFormatIssues;
      if (this.store.form.cardType === "Invalid") {
        console.error("Invalid card type");
        return;
      }
      if (!this.store.form.isValid) {
        console.error("Invalid form");
        return;
      }
      const response = await this.sendPaymentRequest(this.store.form);
      if (response?.success) {
        this.store.toast = {
          header: "Result",
          info: new Date().toLocaleString(),
          body: "Sending payment is successful.",
        };
        this.handleInvoice(response.result);
        this.$refs.toastRef.classList.add("text-bg-success");
        this.$refs.toastRef.classList.remove("text-bg-danger");
      } else {
        this.store.toast = {
          header: "Result",
          info: new Date().toLocaleString(),
          body: response?.message || "Sending payment is failed.",
        };
        this.$refs.toastRef.classList.add("text-bg-danger");
        this.$refs.toastRef.classList.remove("text-bg-success");
      }
      this.$refs.toastRef.classList.add("show");
      setTimeout(() => {
        this.handleCloseToast();
      }, 3000);
    } catch (ex) {
      console.error(ex);
    } finally {
      this.store.isLoading = false;
    }
  },
  async handleCloseToast() {
    this.$refs.toastRef.classList.remove("show");
    this.store.toast = {
      header: "",
      info: "",
      body: "",
    };
  },
  handleInvoice(result) {
    this.store.invoice = {
      amount: result.amount,
      referenceNumber: result.referenceId,
      externalId: result.externalId,
      paymentTime: new Date(result.createdAt).toLocaleString(),
      payVia: result.payVia,
      paymentType: `${result.cardType} CARD`,
      senderName: result.name,
      isVisible: true,
    };
  },
  handleCloseInvoice() {
    this.store.form = {
      price: "",
      name: "",
      currency: "USD",
      cardHolder: "",
      cardNumber: "",
      cardType: "",
      cardExpiry: "",
      cardCVV: "",
      isValid: true,
    };
    this.store.invoice = {
      amount: "",
      referenceNumber: "",
      externalId: "",
      paymentTime: "",
      payVia: "",
      paymentType: "",
      senderName: "",
      isVisible: false,
    };
  },
  async sendPaymentRequest(payload) {
    try {
      const result = await fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await result.json();
      return response;
    } catch (ex) {
      console.error(ex);
    }
  },
};
