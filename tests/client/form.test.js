import formHandler from "../../public/modules/form";
import { initialStore } from "../../public/modules/store";
import { jest } from "@jest/globals";
import { invalidNumberLengthForm, validForm } from "./data";

describe("Form function validation", () => {
  let store = initialStore;
  let mockRefs = {
    formRef: {
      checkValidity: () => {
        return false;
      },
    },
  };
  console.error = jest.fn();

  it("should not trigger payment API if form is invalid", () => {
    const context = { store, $refs: mockRefs };
    const handleSubmitFormWithContext =
      formHandler.handleSubmitForm.bind(context);
    handleSubmitFormWithContext();
    expect(console.error.mock.calls[0][0]).toBe("Invalid form");
  });

  it("should not trigger payment API if some formats on form is invalid although HTML form is invalid", () => {
    mockRefs.formRef.checkValidity = () => {
      return true;
    };
    store.form = invalidNumberLengthForm;
    const context = { store, $refs: mockRefs };
    const handleSubmitFormWithContext =
      formHandler.handleSubmitForm.bind(context);
    handleSubmitFormWithContext();
    expect(console.error.mock.calls[1][0]).toBe("Invalid form");
  });

  it("should trigger payment API and not invalidate form if all formats on form is valid and HTML form is valid", () => {
    mockRefs.formRef.checkValidity = () => {
      return true;
    };
    store.form = validForm;
    const sendPaymentRequest = jest.fn();
    const context = { store, $refs: mockRefs, sendPaymentRequest };
    const handleSubmitFormWithContext =
      formHandler.handleSubmitForm.bind(context);
    handleSubmitFormWithContext();
    expect(console.error.mock.calls[2]).toBeFalsy();
    expect(sendPaymentRequest).toHaveBeenCalledWith(store.form);
  });
});
