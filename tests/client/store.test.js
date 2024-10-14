import { initialStore } from "../../public/modules/store";
import {
  invalidCvvForm,
  invalidExpiryForm,
  invalidNumberLengthForm,
  validForm,
} from "./data";

describe("Form view validation", () => {
  let store;
  beforeAll(() => {
    store = initialStore;
  });

  it("should invalidate form if required fields are empty", () => {
    store.form.isValid = false; //in actual DOM, formRef will invalidate it with checkValidity() method
    const allFieldsInvalid = Object.values(store.$validations).every(
      (className) => className === "form-control is-invalid"
    );
    expect(allFieldsInvalid).toBe(true);
  });

  it("should validate form if required fields are filled", () => {
    store.form.isValid = true;
    store.form = validForm;
    const allFieldsValid = Object.values(store.$validations).every(
      (className) => className === "form-control"
    );
    expect(allFieldsValid).toBe(true);
  });

  it("should invalidate card number field if card number is not enough", () => {
    store.form.isValid = true;
    store.form = invalidNumberLengthForm;
    expect(store.$validations.cardNumber).toBe("form-control is-invalid");
  });

  it("should invalidate card expiry field if date is not fully filled", () => {
    store.form.isValid = true;
    store.form = invalidExpiryForm;
    expect(store.$validations.cardExpiry).toBe("form-control is-invalid");
  });

  it("should invalidate card expiry field if cvv is not fully filled", () => {
    store.form.isValid = true;
    store.form = invalidCvvForm;
    expect(store.$validations.cardCVV).toBe("form-control is-invalid");
  });
});
