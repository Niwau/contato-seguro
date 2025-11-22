import { PaginationParams } from "#utils/pagination.js";
import { NextFunction, Request, Response } from "express";

import { CreateCompanyDTO, UpdateCompanyDTO } from "./company.model.js";
import { CompanyService } from "./company.service.js";

export const service = new CompanyService();

export class CompanyController {
  create = async (req: Request<object, object, CreateCompanyDTO>, res: Response, next: NextFunction) => {
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

  find = async (req: Request<PaginationParams>, res: Response, next: NextFunction) => {
    try {
      const response = await service.find(req.params);
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

  update = async (req: Request<{ id: string }, object, UpdateCompanyDTO>, res: Response, next: NextFunction) => {
    try {
      const response = await service.update(req.params.id, req.body);
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  };
}
