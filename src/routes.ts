import { companyRouter } from "#entities/company/company.routes.js";
import { errorHandler, loggerMiddleware } from "#middlewares/index.js";
import { Router } from "express";

export const routes = Router();

routes.use(loggerMiddleware);

routes.use("/company", companyRouter);

routes.use("/", (_, res) => {
  res.send("Welcome to the Contato Seguro API");
});

routes.use(errorHandler);
