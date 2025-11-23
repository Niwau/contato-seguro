import { app } from "../../app.js";
import { CompanyModel } from "../../entities/company/company.model.js";
import * as db from "../../tests/db.js";
import request from "supertest";
import { beforeAll, afterEach, beforeEach, afterAll, it, describe, expect } from "vitest";

beforeAll(async () => {
  await db.connect();
});

afterEach(async () => {
  await db.clear();
});

afterAll(async () => {
  await db.close();
});

describe("Employee Integration Tests", () => {
  let companyId: string;

  beforeEach(async () => {
    const company = await CompanyModel.create({
      address: { city: "Rio", state: "RJ" },
      cnpj: "12345678000199",
      name: "Tech Test Ltda",
      sector: "IT"
    });
    companyId = company._id.toString();
  });

  // [POST] /employees
  describe("POST /employees", () => {
    it("should create an employee successfully", async () => {
      const res = await request(app).post("/api/v1/employees").send({
        companyId: companyId,
        email: "junior@test.com",
        name: "Junior Dev",
        password: "password123",
        role: "Developer"
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.name).toBe("Junior Dev");
      expect(res.body).not.toHaveProperty("password");
    });

    it("should return 400 if validation fails", async () => {
      const res = await request(app).post("/api/v1/employees").send({
        companyId: companyId,
        name: "No Email",
        password: "123"
      });
      expect(res.status).toBe(400);
    });

    it("should return 404 if company does not exist", async () => {
      const fakeId = "60d0fe4f5311236168a10999";
      const res = await request(app).post("/api/v1/employees").send({
        companyId: fakeId,
        email: "lost@test.com",
        name: "Lost Dev",
        password: "password123",
        role: "Dev"
      });
      expect(res.status).toBe(404);
    });

    it("should return 409 if email already exists", async () => {
      await request(app).post("/api/v1/employees").send({
        companyId,
        email: "duplicate@test.com",
        name: "Dev 1",
        password: "123456",
        role: "Dev"
      });
      const res = await request(app).post("/api/v1/employees").send({
        companyId,
        email: "duplicate@test.com",
        name: "Dev 2",
        password: "123456",
        role: "Dev"
      });
      expect(res.status).toBe(409);
    });

    it("should fail if status is DISMISSED without termination date", async () => {
      const res = await request(app).post("/api/v1/employees").send({
        companyId,
        email: "duplicate@test.com",
        name: "Dev 2",
        password: "123456",
        role: "Dev",
        status: "DISMISSED"
      });
      expect(res.status).toBe(400);
    });

    it("should create with status DISMISSED", async () => {
      const res = await request(app).post("/api/v1/employees").send({
        companyId,
        email: "duplicate@test.com",
        name: "Dev 2",
        password: "123456",
        role: "Dev",
        status: "DISMISSED",
        terminationDate: new Date().toISOString()
      });
      expect(res.status).toBe(201);
    });
  });

  // [GET] /employees
  describe("GET /employees", () => {
    it("should list employees and respect pagination", async () => {
      await request(app).post("/api/v1/employees").send({
        companyId,
        email: "lost@test.com",
        name: "Lost Dev",
        password: "password123",
        role: "Dev"
      });
      await request(app).post("/api/v1/employees").send({
        companyId,
        email: "lost@test2.com",
        name: "Lost Dev",
        password: "password123",
        role: "Dev"
      });
      let res = await request(app).get("/api/v1/employees?limit=1&page=1");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).not.toHaveProperty("password");
    });
  });

  // [GET] /employees/:id
  describe("GET /employees/:id", () => {
    it("should get employee by ID", async () => {
      const createResponse = await request(app).post("/api/v1/employees").send({
        companyId,
        email: "lost@test.com",
        name: "Lost Dev",
        password: "password123",
        role: "Dev"
      });
      const res = await request(app).get(`/api/v1/employees/${createResponse.body._id}`);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(createResponse.body.email);
      expect(res.body).not.toHaveProperty("password");
    });

    it("should return 404 if employee not found", async () => {
      const fakeId = "60d0fe4f5311236168a10999";
      const res = await request(app).get(`/api/v1/employees/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  // [PATCH] /employees/:id
  describe("PATCH /employees/:id", () => {
    it("should update employee details", async () => {
      const createResponse = await request(app).post("/api/v1/employees").send({
        companyId,
        email: "lost@test.com",
        name: "Lost Dev",
        password: "password123",
        role: "Dev"
      });
      const res = await request(app).patch(`/api/v1/employees/${createResponse.body._id}`).send({
        name: "Found Dev"
      });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Found Dev");
      expect(res.body).not.toHaveProperty("password");
    });

    it("should return 400 if validation fails", async () => {
      const createResponse = await request(app).post("/api/v1/employees").send({
        companyId,
        email: "lost@test.com",
        name: "Lost Dev",
        password: "password123",
        role: "Dev"
      });
      const res = await request(app).patch(`/api/v1/employees/${createResponse.body._id}`).send({
        email: "not-an-email"
      });
      expect(res.status).toBe(400);
    });

    it("shoud not allow updating email to an existing one", async () => {
      const emp1 = await request(app).post("/api/v1/employees").send({
        companyId,
        email: "lost@test.com",
        name: "Lost Dev",
        password: "password123",
        role: "Dev"
      });
      const emp2 = await request(app).post("/api/v1/employees").send({
        companyId,
        email: "lost@test2.com",
        name: "Lost Dev",
        password: "password123",
        role: "Dev"
      });
      const res = await request(app).patch(`/api/v1/employees/${emp2.body._id}`).send({
        email: emp1.body.email
      });
      expect(res.status).not.toBe(200);
    });

    it("shoud not allow updating status to DISMISSED without terminationDate", async () => {
      const createResponse = await request(app).post("/api/v1/employees").send({
        companyId,
        email: "lost@test.com",
        name: "Lost Dev",
        password: "password123",
        role: "Dev"
      });
      const res = await request(app).patch(`/api/v1/employees/${createResponse.body._id}`).send({
        status: "DISMISSED"
      });
      expect(res.status).toBe(400);
    });

    it("should return 404 if employee is not found", async () => {
      const fakeId = "60d0fe4f5311236168a10999";
      let res = await request(app).patch(`/api/v1/employees/${fakeId}`).send({
        name: "No One"
      });
      expect(res.status).toBe(404);
    });
  });

  // [DELETE] /employees/:id
  describe("DELETE /employees/:id", () => {
    it("should delete an employee", async () => {
      const createResponse = await request(app).post("/api/v1/employees").send({
        companyId,
        email: "lost@test.com",
        name: "Lost Dev",
        password: "password123",
        role: "Dev"
      });
      const res = await request(app).delete(`/api/v1/employees/${createResponse.body._id}`);
      expect(res.status).toBe(204);
      expect(res.body).toEqual({});

      const getRes = await request(app).get(`/api/v1/employees/${createResponse.body._id}`);
      expect(getRes.status).toBe(404);
    });

    it("should return 404 if employee is not found", async () => {
      const fakeId = "60d0fe4f5311236168a10999";
      let res = await request(app).delete(`/api/v1/employees/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });
});
