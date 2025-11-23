import { isValidObjectId } from "mongoose";

import { EmployeeDTO, EmployeeModel } from "../../entities/employee/employee.model.js";
import { APIError } from "../../utils/error.js";
import { paginate, PaginationParams } from "../../utils/pagination.js";
import {
  CompanyDTO,
  CompanyModel,
  CreateCompanyDTO,
  createCompanySchema,
  UpdateCompanyDTO,
  updateCompanySchema
} from "./company.model.js";

const ENTITY = "Company";

export class CompanyService {
  async create(data: CreateCompanyDTO): Promise<CompanyDTO> {
    const dto = createCompanySchema.parse(data);

    const company = await CompanyModel.findOne({
      cnpj: dto.cnpj
    });

    if (company) {
      throw APIError.alreadyExists(ENTITY);
    }

    return new CompanyModel(dto).save();
  }

  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw APIError.objectId();
    }

    const company = await CompanyModel.findByIdAndDelete(id);

    if (!company) {
      throw APIError.notFound(ENTITY);
    }
  }

  async find(params?: PaginationParams): Promise<CompanyDTO[]> {
    const { limit, skip } = paginate(params);
    return await CompanyModel.find().skip(skip).limit(limit);
  }

  async findById(id: string): Promise<CompanyDTO | null> {
    if (!isValidObjectId(id)) {
      throw APIError.objectId();
    }

    const company = await CompanyModel.findById(id);

    if (!company) {
      throw APIError.notFound(ENTITY);
    }

    return company;
  }

  async findEmployees(id: string, params?: PaginationParams): Promise<EmployeeDTO[]> {
    if (!isValidObjectId(id)) {
      throw APIError.objectId();
    }
    const { limit, skip } = paginate(params);
    return EmployeeModel.find({ companyId: id }).skip(skip).limit(limit);
  }

  async update(id: string, data: UpdateCompanyDTO): Promise<CompanyDTO | null> {
    if (!isValidObjectId(id)) {
      throw APIError.objectId();
    }

    const dto = updateCompanySchema.parse(data);

    const company = await CompanyModel.findByIdAndUpdate(id, dto, {
      new: true
    });

    if (!company) {
      throw APIError.notFound(ENTITY);
    }

    return company;
  }
}
