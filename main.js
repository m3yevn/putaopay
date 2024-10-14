const { configDotenv } = require("dotenv");
const { startServer } = require("./server");
configDotenv();

const port = process.env.PORT || 3000;
startServer({ port });
