import mongoose, { Schema } from "mongoose";

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
