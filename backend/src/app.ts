import express from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { companyRouter } from "./modules/company/company.routes.js";
import { companyMemberRouter } from "./modules/company_member/company_member.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { siteRouter } from "./modules/site/site.routes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/company", authMiddleware, companyRouter);
app.use("/api/v1/company-members", authMiddleware, companyMemberRouter);
app.use("/api/v1/sites", authMiddleware, siteRouter);
app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

app.use(errorMiddleware);

export default app;

