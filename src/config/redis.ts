import { Redis } from "ioredis";

import { logger } from "../utils/logger.js";
import { REDIS_URL } from "./constants.js";

const redis: Redis = new Redis(REDIS_URL ?? "", {
  enableOfflineQueue: false
});

redis.on("error", (err) => logger.error(`Redis Error: ${err}`));
redis.on("connect", () => logger.info("Redis connected"));

export { redis };
