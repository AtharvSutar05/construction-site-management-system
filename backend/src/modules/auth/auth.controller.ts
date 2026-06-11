import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

class AuthController {
    register = async (req: Request, res: Response) => {
        try {
            const validateData = registerSchema.parse(req.body);
            const user = await authService.registerUser(validateData);
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user,
            });
        } catch(error) {
            return res.status(400).json({
                success: false,
                message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
            });
        } 
    }

    login = async (req: Request, res: Response) => {
        try {
            const validateData = loginSchema.parse(req.body);
            const user = await authService.loginUser(validateData);
            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                data: user,
            });
        } catch(error) {
            return res.status(400).json({
                success: false,
                message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
            });
        }
    }
}

export const authController = new AuthController();