import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema(
  {
    company: {
      ref: "Company",
      required: true,
      type: Schema.Types.ObjectId
    },
    email: {
      required: true,
      type: String,
      unique: true
    },
    name: {
      required: true,
      type: String
    },
    password: {
      required: true,
      select: false,
      type: String
    },
    role: {
      required: true,
      type: String
    },
    status: {
      default: "ACTIVE",
      enum: ["ACTIVE", "DISMISSED", "ON_VACATION"],
      type: String
    },
    terminationDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const EmployeeModel = mongoose.model("Employee", employeeSchema);
