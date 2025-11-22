import { Router } from "express";

import { EmployeeController } from "./employee.controller.js";

const router = Router();
const controller = new EmployeeController();

router.get("/", controller.find);
router.get("/:id", controller.findById);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

export { router as employeeRouter };
