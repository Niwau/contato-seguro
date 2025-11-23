import winston from "winston";

import { LOG_LEVEL } from "../config/constants.js";

export const logger = winston.createLogger({
  format: winston.format.json(),
  level: LOG_LEVEL,
  transports: [
    new winston.transports.Console({
      format: winston.format.prettyPrint()
    })
  ]
});
