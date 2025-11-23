import { NextFunction, Request, Response } from "express";

import { PaginationParams } from "../../utils/pagination.js";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "./employee.model.js";
import { EmployeeService } from "./employee.service.js";

export const service = new EmployeeService();

export class EmployeeController {
  create = async (req: Request<object, object, CreateEmployeeDTO>, res: Response, next: NextFunction) => {
    try {
      const response = await service.create(req.body);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await service.delete(req.params.id);
      res.status(204).json();
    } catch (e) {
      next(e);
    }
  };

  find = async (req: Request<object, object, PaginationParams>, res: Response, next: NextFunction) => {
    try {
      const response = await service.find(req.query);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };

  findById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const response = await service.findById(req.params.id);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };

  update = async (req: Request<{ id: string }, object, UpdateEmployeeDTO>, res: Response, next: NextFunction) => {
    try {
      const response = await service.update(req.params.id, req.body);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };
}
