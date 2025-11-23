import { OpenAPIV3 } from "openapi-types";

export const paths: OpenAPIV3.PathsObject = {
  // --- COMPANIES ---
  "/companies": {
    post: {
      tags: ["Companies"],
      summary: "Cria uma nova empresa",
      description: "Valida CNPJ único e dados obrigatórios.",
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/CreateCompanyInput" } }
        }
      },
      responses: {
        201: {
          description: "Empresa criada",
          content: { "application/json": { schema: { $ref: "#/components/schemas/CompanyResponse" } } }
        },
        400: {
          description: "Erro de validação (Zod)",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } } }
        },
        409: {
          description: "CNPJ já cadastrado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } }
        }
      }
    },
    get: {
      tags: ["Companies"],
      summary: "Lista empresas paginadas",
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
      ],
      responses: {
        200: {
          description: "Lista de empresas",
          content: {
            "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/CompanyResponse" } } }
          }
        }
      }
    }
  },
  "/companies/{id}": {
    get: {
      tags: ["Companies"],
      summary: "Busca empresa por ID",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        200: {
          description: "Dados da empresa",
          content: { "application/json": { schema: { $ref: "#/components/schemas/CompanyResponse" } } }
        },
        400: { description: "ID Inválido" },
        404: { description: "Empresa não encontrada" }
      }
    },
    put: {
      tags: ["Companies"],
      summary: "Atualiza dados da empresa",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateCompanyInput" } } }
      },
      responses: {
        200: {
          description: "Empresa atualizada",
          content: { "application/json": { schema: { $ref: "#/components/schemas/CompanyResponse" } } }
        },
        404: { description: "Empresa não encontrada" }
      }
    },
    delete: {
      tags: ["Companies"],
      summary: "Deleta uma empresa",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        204: { description: "Empresa deletada com sucesso" },
        404: { description: "Empresa não encontrada" }
      }
    }
  },
  "/companies/{id}/employees": {
    get: {
      tags: ["Companies", "Employees"],
      summary: "Lista funcionários de uma empresa específica",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "ID da Empresa" },
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
      ],
      responses: {
        200: {
          description: "Lista de funcionários da empresa",
          content: {
            "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/EmployeeResponse" } } }
          }
        },
        400: { description: "ID da empresa inválido" }
      }
    }
  },

  // --- EMPLOYEES ---
  "/employees": {
    post: {
      tags: ["Employees"],
      summary: "Cria novo funcionário",
      description: "Requer ID de uma empresa existente. Valida unicidade de email.",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CreateEmployeeInput" } } }
      },
      responses: {
        201: {
          description: "Funcionário criado",
          content: { "application/json": { schema: { $ref: "#/components/schemas/EmployeeResponse" } } }
        },
        400: { description: "Erro de validação (Zod) ou ObjectId inválido" },
        404: { description: "Empresa associada não encontrada" },
        409: { description: "Email já cadastrado" }
      }
    },
    get: {
      tags: ["Employees"],
      summary: "Lista todos os funcionários",
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
      ],
      responses: {
        200: {
          description: "Lista geral",
          content: {
            "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/EmployeeResponse" } } }
          }
        }
      }
    }
  },
  "/employees/{id}": {
    get: {
      tags: ["Employees"],
      summary: "Busca funcionário por ID",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        200: {
          description: "Dados do funcionário",
          content: { "application/json": { schema: { $ref: "#/components/schemas/EmployeeResponse" } } }
        },
        404: { description: "Funcionário não encontrado" }
      }
    },
    put: {
      tags: ["Employees"],
      summary: "Atualiza funcionário",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateEmployeeInput" } } }
      },
      responses: {
        200: {
          description: "Atualizado com sucesso",
          content: { "application/json": { schema: { $ref: "#/components/schemas/EmployeeResponse" } } }
        },
        404: { description: "Funcionário não encontrado" }
      }
    },
    delete: {
      tags: ["Employees"],
      summary: "Deleta funcionário",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        204: { description: "Deletado com sucesso" },
        404: { description: "Funcionário não encontrado" }
      }
    }
  }
};
