const { Router } = require("express");

const routes = Router();

routes.get("/healthcheck", (req, res) => {
  res.json({ success: true, message: "API is healthy" });
});

routes.post("/payment", (req, res) => {
  
});

module.exports = {
  routes,
};
