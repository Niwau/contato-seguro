import { apiReference } from "@scalar/express-api-reference";
import { Router } from "express";

import { swaggerDocument } from "./docs/index.js";
import { companyRouter } from "./entities/company/company.routes.js";
import { employeeRouter } from "./entities/employee/employee.routes.js";

export const routes = Router();

routes.use(
  "/docs",
  apiReference({
    content: swaggerDocument,
    theme: "deepSpace"
  })
);

routes.use("/companies", companyRouter);
routes.use("/employees", employeeRouter);
