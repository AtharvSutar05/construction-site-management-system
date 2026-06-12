import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import {  UserRole } from "../../shared/enums/role.enum.js";
import { validate } from "../../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

export const authRouter = Router();

authRouter.get(
  "/admin-test",
  authMiddleware,
  authorize(UserRole.ADMIN),
  (_, res) => {
    return res.json({
      message: "Admin route"
    });
  }
);

authRouter.get(
  "/me",
  authMiddleware,
  authController.me
)

authRouter.post(
  "/register",
  validate(registerSchema),
  authController.register
);

authRouter.post(
  "/login",
  validate(loginSchema),
  authController.login
);

