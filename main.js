import { configDotenv } from "dotenv";
import { startServer } from "./server.js";
configDotenv();

const port = process.env.PORT || 3000;
startServer({ port });
