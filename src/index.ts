import { SERVER_PORT } from "#config/constants.js";
import { mongo } from "#config/mongo.js";
import { logger } from "#utils/logger.js";
import express from "express";

const app = express();
app.use(express.json());

await mongo.connect();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(SERVER_PORT, () => {
  logger.info(`Server started!`);
});
