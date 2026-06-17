import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { validateSchema } from "../../middleware/validate_schema.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

export const authRouter = Router();

authRouter.get(
  "/me",
  authMiddleware,
  authController.me
)

authRouter.post(
  "/register",
  validateSchema(registerSchema),
  authController.register
);

authRouter.post(
  "/login",
  validateSchema(loginSchema),
  authController.login
);

