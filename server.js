const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { routes } = require("./routes");

dotenv.config();
const port = process.env.PORT || 3000;

app.use("/", express.static("public"));
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
