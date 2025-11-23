import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import { ZodError } from "zod";

import { redis } from "../config/redis.js";
import { APIError } from "../utils/error.js";
import { logger } from "../utils/logger.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  logger.error(`[${req.method}] ${req.originalUrl} - Error: ${String(error)}`);

  if (error instanceof APIError) {
    return res.status(error.code).json({ code: error.code, message: error.message });
  }

  if (error instanceof ZodError) {
    const fields = error.issues.map((issue) => ({
      message: issue.message,
      path: issue.path.join(".")
    }));
    return res.status(400).json({ code: 400, fields, message: `Validation error` });
  }

  return res.status(500).json({ code: 500, message: "Internal Server Error" });
};

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.debug(
    `[${req.method}] ${req.originalUrl} with query ${JSON.stringify(req.query)} and body ${JSON.stringify(req.body)}`
  );
  next();
};

const rateLimiter = new RateLimiterRedis({
  duration: 1,
  keyPrefix: "rate_limit",
  points: 10,
  storeClient: redis
});

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.ip) {
    logger.warn("Rate limit skipped: Unable to determine IP address");
    next();
    return;
  }

  rateLimiter
    .consume(req.ip)
    .then((rateLimiterRes) => {
      logger.debug("Rate Limited Result:", rateLimiterRes);
      next();
    })
    .catch((rateLimiterRes: unknown) => {
      if (rateLimiterRes instanceof RateLimiterRes) {
        logger.warn(`Rate limit exceeded for IP: ${req.ip ?? "unknown"}`);

        return res.status(429).json({
          code: 429,
          message: "Too Many Requests - your IP is being rate limited"
        });
      }

      logger.error("Rate limiter error:", rateLimiterRes);
      next();
    });
};
