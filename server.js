const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { routes } = require("./routes");
const databaseService = require("./services/databaseService");
const paypalService = require("./services/paypalService");
const braintreeService = require("./services/braintreeService");

function startServer({ port }) {
  try {
    databaseService.createDB();
    paypalService.createConfig();
    braintreeService.createGateway();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use("/", express.static("public"));
    app.use("/helpers", express.static("helpers"));
    app.use("/api", routes);
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(err.status).json({
        error: err.title,
        message: err.message,
      });
    });

    const httpServer = app.listen(port, () => {
      console.log(`Server is listening on ${port}`);
    });

    return { httpServer, app };
  } catch (ex) {
    console.error("Server is failed to start.", ex);
  }
}

module.exports = {
  startServer,
};
