import { app } from "../../app.js";
import { EmployeeModel } from "#entities/employee/employee.model.js"; // Necessário para testar a relação
import * as db from "#tests/db.js";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
  await db.connect();
});

afterEach(async () => {
  await db.clear();
});

afterAll(async () => {
  await db.close();
});

describe("Company Integration Tests", () => {
  const validCompany = {
    name: "Tech Solutions",
    cnpj: "12345678000199",
    sector: "Technology",
    address: {
      city: "São Paulo",
      state: "SP"
    }
  };

  // [POST] /companies
  describe("POST /companies", () => {
    it("should create a company successfully", async () => {
      const res = await request(app).post("/api/v1/companies").send(validCompany);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.name).toBe(validCompany.name);
      expect(res.body.cnpj).toBe(validCompany.cnpj);
    });

    it("should return 400 if validation fails", async () => {
      const invalidData = {
        name: "No Address Co",
        cnpj: "123",
        sector: "IT"
      };
      const res = await request(app).post("/api/v1/companies").send(invalidData);
      expect(res.status).toBe(400);
    });

    it("should return 409 if CNPJ already exists", async () => {
      await request(app).post("/api/v1/companies").send(validCompany);
      const res = await request(app)
        .post("/api/v1/companies")
        .send({
          ...validCompany,
          name: "Other Name"
        });
      expect(res.status).toBe(409);
    });
  });

  // [GET] /companies
  describe("GET /companies", () => {
    it("should list companies with pagination", async () => {
      await request(app).post("/api/v1/companies").send(validCompany);
      await request(app)
        .post("/api/v1/companies")
        .send({
          ...validCompany,
          cnpj: "98765432000100",
          name: "Second Co"
        });
      const res = await request(app).get("/api/v1/companies?limit=1&page=1");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // [GET] /companies/:id
  describe("GET /companies/:id", () => {
    it("should get company by ID", async () => {
      const createRes = await request(app).post("/api/v1/companies").send(validCompany);
      const id = createRes.body._id;
      const res = await request(app).get(`/api/v1/companies/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.cnpj).toBe(validCompany.cnpj);
    });

    it("should return 400 for invalid ObjectID format", async () => {
      const res = await request(app).get("/api/v1/companies/12345");
      expect(res.status).toBe(400);
    });

    it("should return 404 if company not found", async () => {
      const fakeId = "60d0fe4f5311236168a10999";
      const res = await request(app).get(`/api/v1/companies/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  // [PATCH] /companies/:id
  describe("PATCH /companies/:id", () => {
    it("should update company details", async () => {
      const createRes = await request(app).post("/api/v1/companies").send(validCompany);
      const id = createRes.body._id;
      const res = await request(app).patch(`/api/v1/companies/${id}`).send({
        name: "Updated Name",
        sector: "Health"
      });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Updated Name");
      expect(res.body.sector).toBe("Health");
      expect(res.body.cnpj).toBe(validCompany.cnpj);
    });

    it("should not update cnpj", async () => {
      const createRes = await request(app).post("/api/v1/companies").send(validCompany);
      const id = createRes.body._id;
      const res = await request(app).patch(`/api/v1/companies/${id}`).send({
        cnpj: "00000000000000"
      });
      expect(res.status).toBe(200);
      expect(res.body.cnpj).toBe(validCompany.cnpj);
    });

    it("should return 400 for invalid ObjectID format", async () => {
      const res = await request(app).patch("/api/v1/companies/12345").send({});
      expect(res.status).toBe(400);
    });

    it("should return 400 if validation fails", async () => {
      const createRes = await request(app).post("/api/v1/companies").send(validCompany);
      expect(createRes.status).toBe(201);

      const id = createRes.body._id;
      const res = await request(app).patch(`/api/v1/companies/${id}`).send({
        name: ""
      });
      expect(res.status).toBe(400);
    });

    it("should return 404 if company not found", async () => {
      const fakeId = "60d0fe4f5311236168a10999";
      const res = await request(app).patch(`/api/v1/companies/${fakeId}`).send({
        name: "Ghost Co"
      });
      expect(res.status).toBe(404);
    });
  });

  // [DELETE] /companies/:id
  describe("DELETE /companies/:id", () => {
    it("should delete a company", async () => {
      const createRes = await request(app).post("/api/v1/companies").send(validCompany);
      const id = createRes.body._id;
      const res = await request(app).delete(`/api/v1/companies/${id}`);
      expect(res.status).toBe(204);
      const check = await request(app).get(`/api/v1/companies/${id}`);
      expect(check.status).toBe(404);
    });
  });

  // [GET] /companies/:id/employees
  describe("GET /companies/:id/employees", () => {
    it("should list employees belonging to the company", async () => {
      const companyRes = await request(app).post("/api/v1/companies").send(validCompany);
      const companyId = companyRes.body._id;
      await request(app).post("/api/v1/employees").send({
        companyId,
        name: "Alice",
        email: "alice@email.com",
        password: "password123",
        role: "Developer"
      });
      await request(app).post("/api/v1/employees").send({
        companyId,
        name: "InChains",
        email: "inthebox@email.com",
        password: "password123",
        role: "Developer"
      });
      const res = await request(app).get(`/api/v1/companies/${companyId}/employees`);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].companyId).toBe(companyId);
    });

    it("should return 400 for invalid company ID", async () => {
      const res = await request(app).get("/api/v1/companies/invalid-id/employees");
      expect(res.status).toBe(400);
    });
  });
});
