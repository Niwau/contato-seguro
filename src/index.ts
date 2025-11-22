import { SERVER_PORT } from "#config/constants.js";
import { mongo } from "#config/mongo.js";
import { routes } from "#routes.js";
import { logger } from "#utils/logger.js";
import express from "express";

const app = express();
app.use(express.json());

await mongo.connect().catch((e: unknown) => {
  logger.error("Failed to connect to MongoDB:", e);
});

app.use("/api/v1", routes);

app.listen(SERVER_PORT, () => {
  logger.info(`Server started!`);
});
