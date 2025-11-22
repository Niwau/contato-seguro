import { routes } from "#routes.js";
import express from "express";

const app = express();

app.use(express.json());

app.use("/api/v1", routes);

export { app };
