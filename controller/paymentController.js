import paymentService from "../services/paymentService.js";
import databaseService from "../services/databaseService.js";

const postPayment = async (req, res) => {
  try {
    const { price, name, currency, ...creditCard } = req.body;
    const { result, dbPayload } = await paymentService.makePayment({
      name,
      price,
      currency,
      creditCard,
    });

    databaseService.createOrder(dbPayload);

    res.json({ success: true, result });
  } catch (ex) {
    console.error(ex);
    res.status(ex?.status || 500).json({
      success: false,
      error: ex?.title || "SERVER ERROR",
      message: ex.message,
    });
  }
};

export default {
  postPayment,
};
