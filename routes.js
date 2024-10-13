const { Router } = require("express");

const routes = Router();

routes.get("/healthcheck", (req, res) => {
  res.json({ success: true, message: "API is healthy" });
});

routes.post("/pay", (req, res) => {
  res.json({ success: true, message: "API is healthy" });
});

module.exports = {
  routes,
};
