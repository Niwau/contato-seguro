import { logger } from "#utils/logger.js";
import mongoose from "mongoose";

import { MONGO_URI } from "./constants.js";

export const mongo = {
  async connect() {
    try {
      if (!MONGO_URI) {
        throw new Error("Missing MONGO_URI environment variable");
      }
      logger.info("Trying to connect to MongoDB...");
      await mongoose.connect(MONGO_URI, {
        dbName: "contato-seguro"
      });
      logger.info("Connected to MongoDB");
    } catch (e) {
      logger.error(`Failed to connect to MongoDB:`, e);
    }
  }
};
