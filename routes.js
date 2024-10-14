const { Router } = require("express");
const paymentController = require("./controller/paymentController");
const {
  paymentParamsValidator,
  paymentFormatValidator,
} = require("./helpers/validators");

const routes = Router();

routes.get("/healthcheck", (req, res) => {
  res.json({ success: true, message: "API is healthy" });
});

routes.post(
  "/payment",
  paymentParamsValidator,
  paymentFormatValidator,
  paymentController.postPayment
);

module.exports = {
  routes,
};
