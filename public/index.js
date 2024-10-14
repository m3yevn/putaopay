import formHandler from "./modules/form.js";
import { createApp, reactive } from "./modules/petite-vue.js";
import { initialStore } from "./modules/store.js";

export const store = reactive(initialStore);

export function Form(props) {
  return {
    $template: "#form-template",
    store,
    ...formHandler,
  };
}

createApp({ Form }).mount();
