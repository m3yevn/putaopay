import paymentService from "../services/paymentService.js";

const postPayment = async (req, res) => {
  try {
    const { price, name, ...creditCard } = req.body;
    const result = await paymentService.makePayment({
      name,
      price,
      creditCard,
    });

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
