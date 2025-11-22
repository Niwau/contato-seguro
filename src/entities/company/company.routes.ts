import { Router } from "express";

import { CompanyController } from "./company.controller.js";

const router = Router();
const controller = new CompanyController();

router.get("/", controller.find);
router.get("/:id", controller.findById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export { router as companyRouter };
