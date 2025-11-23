import express from "express";

import { errorHandler, loggerMiddleware, rateLimiterMiddleware } from "./middlewares/index.js";
import { routes } from "./routes.js";

const app = express();

app.use(express.json());

app.use(loggerMiddleware);

if (process.env.NODE_ENV !== "test") {
  app.use(rateLimiterMiddleware);
}

app.use("/api/v1", routes);
app.use(errorHandler);

export { app };
