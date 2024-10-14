import { Router } from "express";
import paymentController from "./controller/paymentController.js";
import {
  paymentParamsValidator,
  paymentFormatValidator,
} from "./helpers/validators.js";

export const routes = Router();

routes.get("/healthcheck", (req, res) => {
  res.json({ success: true, message: "API is healthy" });
});

routes.post(
  "/payment",
  paymentParamsValidator,
  paymentFormatValidator,
  paymentController.postPayment
);
