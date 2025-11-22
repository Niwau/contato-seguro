import { OpenAPIV3 } from "openapi-types";

export const components: OpenAPIV3.ComponentsObject = {
  schemas: {
    // --- Utilitários ---
    ValidationError: {
      type: "object",
      properties: {
        code: { type: "integer", example: 400 },
        message: { type: "string", example: "Validation error" },
        fields: {
          type: "array",
          items: {
            type: "object",
            properties: {
              message: { type: "string", example: "Required" },
              path: { type: "string", example: "address.city" }
            }
          }
        }
      }
    },
    Error: {
      type: "object",
      properties: {
        code: { type: "integer", example: 400 },
        message: { type: "string", example: "Invalid ID" }
      }
    },
    // --- Company Schemas ---
    CreateCompanyInput: {
      type: "object",
      required: ["name", "cnpj", "sector", "address"],
      properties: {
        name: { type: "string", example: "Tech Solutions LTDA", minLength: 1, maxLength: 100 },
        cnpj: { type: "string", example: "12345678000199", minLength: 1, maxLength: 20 },
        sector: { type: "string", example: "Tecnologia", minLength: 1, maxLength: 100 },
        address: {
          type: "object",
          required: ["city", "state"],
          properties: {
            city: { type: "string", example: "Porto Alegre" },
            state: { type: "string", example: "RS" }
          }
        }
      }
    },
    UpdateCompanyInput: {
      type: "object",
      description: "CNPJ não pode ser atualizado",
      properties: {
        name: { type: "string", example: "Tech Solutions Global" },
        sector: { type: "string", example: "Consultoria" },
        address: {
          type: "object",
          properties: {
            city: { type: "string" },
            state: { type: "string" }
          }
        }
      }
    },
    CompanyResponse: {
      type: "object",
      properties: {
        _id: { type: "string", example: "60d0fe4f5311236168a109ca" },
        name: { type: "string", example: "Tech Solutions LTDA" },
        cnpj: { type: "string", example: "12345678000199" },
        sector: { type: "string", example: "Tecnologia" },
        address: {
          type: "object",
          properties: {
            city: { type: "string" },
            state: { type: "string" }
          }
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      }
    },

    // --- Employee Schemas ---
    CreateEmployeeInput: {
      type: "object",
      required: ["companyId", "email", "name", "password", "role"],
      properties: {
        companyId: { type: "string", description: "ObjectId válido da empresa", example: "60d0fe4f5311236168a109ca" },
        name: { type: "string", example: "João da Silva" },
        email: { type: "string", format: "email", example: "joao@tech.com" },
        password: { type: "string", format: "password", example: "senhaForte123" },
        role: { type: "string", example: "Developer" },
        status: { type: "string", enum: ["ACTIVE", "DISMISSED", "ON_VACATION"], default: "ACTIVE" },
        terminationDate: { type: "string", format: "date-time", nullable: true }
      }
    },
    UpdateEmployeeInput: {
      type: "object",
      description: "CompanyId não pode ser atualizado",
      properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
        role: { type: "string" },
        status: { type: "string", enum: ["ACTIVE", "DISMISSED", "ON_VACATION"] },
        terminationDate: { type: "string", format: "date-time" }
      }
    },
    EmployeeResponse: {
      type: "object",
      description: "Objeto de retorno sem a senha",
      properties: {
        _id: { type: "string", example: "65a123b...123" },
        companyId: { type: "string", example: "60d0fe4f5311236168a109ca" },
        name: { type: "string", example: "João da Silva" },
        email: { type: "string", example: "joao@tech.com" },
        role: { type: "string", example: "Developer" },
        status: { type: "string", example: "ACTIVE" },
        terminationDate: { type: "string", format: "date-time", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      }
    }
  }
};
