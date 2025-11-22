import mongoose, { Schema } from "mongoose";
import z from "zod";

const companySchema = new Schema(
  {
    address: {
      city: { required: true, trim: true, type: String },
      state: { required: true, trim: true, type: String }
    },
    cnpj: { required: true, trim: true, type: String, unique: true },
    name: { required: true, trim: true, type: String },
    sector: { required: true, trim: true, type: String }
  },
  { timestamps: true }
);

export const CompanyModel = mongoose.model("Company", companySchema);

export const createCompanySchema = z.object({
  address: z.object({
    city: z.string().min(1).max(100).trim(),
    state: z.string().min(1).max(100).trim()
  }),
  cnpj: z.string().min(1).max(20).trim(),
  name: z.string().min(1).max(100).trim(),
  sector: z.string().min(1).max(100).trim()
});

export const updateCompanySchema = createCompanySchema.partial().omit({
  cnpj: true
});

export type CompanyDTO = mongoose.InferSchemaType<typeof companySchema>;

export type CreateCompanyDTO = z.infer<typeof createCompanySchema>;
export type UpdateCompanyDTO = z.infer<typeof updateCompanySchema>;
