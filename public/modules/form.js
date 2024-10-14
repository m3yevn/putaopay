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
      if (response) {
        this.store.toast = {
          header: "Result",
          info: new Date().toLocaleTimeString(),
          body: "Sending payment is successful.",
        };
        this.$refs.toastRef.classList.add("text-bg-success");
        this.$refs.toastRef.classList.remove("text-bg-danger");
      } else {
        this.store.toast = {
          header: "Result",
          info: new Date().toLocaleTimeString(),
          body: "Sending payment is failed.",
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
      if (response.success) {
        return response;
      }
    } catch (ex) {
      console.error(ex);
    }
  },
};
