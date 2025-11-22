import { OpenAPIV3 } from "openapi-types";
import { components } from "./components.js";
import { paths } from "./paths.js";

export const swaggerDocument: OpenAPIV3.Document = {
  info: {
    contact: {
      name: "Guilherme Ribeiro"
    },
    description: "Documentação da API do projeto Contato Seguro.",
    title: "Contato Seguro",
    version: "1.0.0"
  },
  openapi: "3.0.0",
  components,
  paths,
  servers: [
    {
      description: "Servidor Local",
      url: "http://localhost:3000/api/v1"
    }
  ],
  tags: [
    {
      description: "Endpoints relacionados à gestão de empresas",
      name: "Companies"
    },
    {
      description: "Endpoints relacionados à gestão de funcionários",
      name: "Employees"
    }
  ]
};
