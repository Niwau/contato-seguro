import { CompanyModel } from "#entities/company/company.model.js";
import { APIError } from "#utils/error.js";
import { hashPassword } from "#utils/hash.js";
import { paginate, PaginationParams } from "#utils/pagination.js";
import { isValidObjectId } from "mongoose";

import {
  CreateEmployeeDTO,
  createEmployeeSchema,
  EmployeeDTO,
  EmployeeModel,
  UpdateEmployeeDTO,
  updateEmployeeSchema
} from "./employee.model.js";

const ENTITY = "Employee";

export class EmployeeService {
  async create(data: CreateEmployeeDTO): Promise<EmployeeDTO> {
    const dto = createEmployeeSchema.parse(data);
    const company = await CompanyModel.findById(dto.companyId);

    if (!company) {
      throw APIError.notFound("Associated company");
    }

    const employee = await EmployeeModel.findOne({
      email: dto.email
    });

    if (employee) {
      throw APIError.alreadyExists(ENTITY);
    }

    const hashedPassword = await hashPassword(dto.password);
    dto.password = hashedPassword;

    // TODO: remove password from returned object
    return await new EmployeeModel(dto).save();
  }

  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw APIError.objectId();
    }

    const employee = await EmployeeModel.findByIdAndDelete(id);

    if (!employee) {
      throw APIError.notFound(ENTITY);
    }
  }

  async find(params?: PaginationParams): Promise<EmployeeDTO[]> {
    const pagination = paginate(params);
    return await EmployeeModel.find().skip(pagination.skip).limit(pagination.limit);
  }

  async findById(id: string): Promise<EmployeeDTO | null> {
    if (!isValidObjectId(id)) {
      throw APIError.objectId();
    }

    const employee = await EmployeeModel.findById(id);

    if (!employee) {
      throw APIError.notFound(ENTITY);
    }

    return employee;
  }

  async update(id: string, data: UpdateEmployeeDTO): Promise<EmployeeDTO | null> {
    if (!isValidObjectId(id)) {
      throw APIError.objectId();
    }

    const dto = updateEmployeeSchema.parse(data);

    const employee = await EmployeeModel.findByIdAndUpdate(id, dto, {
      new: true
    });

    if (!employee) {
      throw APIError.notFound(ENTITY);
    }

    return employee;
  }
}
