import { swaggerDocument } from "#docs/index.js";
import { companyRouter } from "#entities/company/company.routes.js";
import { employeeRouter } from "#entities/employee/employee.routes.js";
import { errorHandler, loggerMiddleware } from "#middlewares/index.js";
import { apiReference } from "@scalar/express-api-reference";
import { Router } from "express";

export const routes = Router();

routes.use(loggerMiddleware);

routes.use(
  "/docs",
  apiReference({
    content: swaggerDocument,
    theme: "deepSpace"
  })
);

routes.use("/companies", companyRouter);
routes.use("/employees", employeeRouter);

routes.use(errorHandler);
