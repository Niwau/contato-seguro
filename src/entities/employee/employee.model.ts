import mongoose, { isValidObjectId, Schema } from "mongoose";
import z from "zod";

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

export const createEmployeeSchema = z
  .object({
    companyId: z.string().min(1).max(24).trim(),
    email: z.email().max(100).trim(),
    name: z.string().min(1).max(100).trim(),
    password: z.string().min(6).max(100).trim(),
    role: z.string().min(1).max(100).trim(),
    status: z.enum(["ACTIVE", "DISMISSED", "ON_VACATION"]).optional(),
    terminationDate: z.date().optional()
  })
  .superRefine((data, ctx) => {
    if (data.status === "DISMISSED" && !data.terminationDate) {
      ctx.addIssue({
        code: "custom",
        message: "terminationDate is required when status is DISMISSED",
        path: ["terminationDate"]
      });
    }

    if (!isValidObjectId(data.companyId)) {
      ctx.addIssue({
        code: "custom",
        message: "companyId must be a valid ObjectId",
        path: ["companyId"]
      });
    }
  });

export const updateEmployeeSchema = createEmployeeSchema.partial().omit({
  companyId: true
});

export type CreateEmployeeDTO = z.infer<typeof createEmployeeSchema>;
export type EmployeeDTO = mongoose.InferSchemaType<typeof employeeSchema>;
export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeSchema>;

export const EmployeeModel = mongoose.model("Employee", employeeSchema);
