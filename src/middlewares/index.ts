import { APIError } from "#utils/error.js";
import { logger } from "#utils/logger.js";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

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
