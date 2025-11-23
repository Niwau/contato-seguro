import { app } from "./app.js";
import { SERVER_PORT } from "./config/constants.js";
import { mongo } from "./config/mongo.js";
import { logger } from "./utils/logger.js";

async function boostrap() {
  await mongo.connect();

  app.listen(SERVER_PORT, () => {
    logger.info(`Server started on port ${SERVER_PORT.toString()}`);
  });
}

boostrap().catch((e: unknown) => {
  if (e instanceof Error) {
    return logger.error(e.message);
  }

  logger.error("An unknown error occurred during bootstrap");
});
