import express from "express";
import bodyParser from "body-parser";
import { routes } from "./routes.js";
import databaseService from "./services/databaseService.js";
import paypalService from "./services/paypalService.js";
import braintreeService from "./services/braintreeService.js";

export function startServer({ port }) {
  try {
    const app = express();
    databaseService.createDB();
    paypalService.createConfig();
    braintreeService.createGateway();

    app.use("/", express.static("public"));
    app.get("/", (req, res) => {
      res.sendFile("index.html", { root: path.join(__dirname, "public") });
    });
    app.use("/api", bodyParser.json());
    app.use(
      "/api",
      bodyParser.urlencoded({
        extended: false,
      })
    );
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
