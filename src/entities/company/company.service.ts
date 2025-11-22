import { EmployeeDTO, EmployeeModel } from "#entities/employee/employee.model.js";
import { APIError } from "#utils/error.js";
import { paginate, PaginationParams } from "#utils/pagination.js";
import { isValidObjectId } from "mongoose";

import { CompanyDTO, CompanyModel, CreateCompanyDTO, createCompanySchema, UpdateCompanyDTO } from "./company.model.js";

export class CompanyService {
  async create(data: CreateCompanyDTO): Promise<CompanyDTO> {
    const dto = createCompanySchema.parse(data);

    const company = await CompanyModel.findOne({
      cnpj: dto.cnpj
    });

    if (company) {
      throw new APIError("Company with this CNPJ already exists", 409);
    }

    return new CompanyModel(dto).save();
  }

  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new APIError("Invalid ID", 400);
    }

    const company = await CompanyModel.findByIdAndDelete(id);

    if (!company) {
      throw new APIError("Company not found", 404);
    }
  }

  async find(params?: PaginationParams): Promise<CompanyDTO[]> {
    const { limit, skip } = paginate(params);
    return await CompanyModel.find().skip(skip).limit(limit);
  }

  async findById(id: string): Promise<CompanyDTO | null> {
    if (!isValidObjectId(id)) {
      throw new APIError("Invalid ID", 400);
    }

    const company = await CompanyModel.findById(id);

    if (!company) {
      throw new APIError("Company not found", 404);
    }

    return company;
  }

  async findEmployees(id: string, params?: PaginationParams): Promise<EmployeeDTO[]> {
    if (!isValidObjectId(id)) {
      throw new APIError("Invalid ID", 400);
    }
    const { limit, skip } = paginate(params);
    return EmployeeModel.find({ company: id }).skip(skip).limit(limit);
  }

  async update(id: string, data: UpdateCompanyDTO): Promise<CompanyDTO | null> {
    if (!isValidObjectId(id)) {
      throw new APIError("Invalid ID", 400);
    }

    const company = await CompanyModel.findByIdAndUpdate(id, data, {
      new: true
    });

    if (!company) {
      throw new APIError("Company not found", 404);
    }

    return company;
  }
}
