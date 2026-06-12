import express from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { companyRouter } from "./modules/company/company.routes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/company", authMiddleware, companyRouter);
app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

export default app;

