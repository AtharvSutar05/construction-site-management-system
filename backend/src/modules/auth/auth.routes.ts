import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.get(
  "/me",
  authMiddleware,
  authController.me
)

authRouter.post(
  "/register",
  authController.register
);

authRouter.post(
  "/login",
  authController.login
);

