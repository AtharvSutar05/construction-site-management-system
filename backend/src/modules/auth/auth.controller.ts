import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

class AuthController {

    me = async (req: Request, res: Response) => {
        try {
            const user = await authService.getCurrentUser(req.user!.userId); 
            return res.status(200)
                .json({
                    success: true,
                    data: {
                        "id": user?.id,
                        "name": user?.name,
                        "email": user?.email
                    }
                });
        } catch (error) {
            return res.status(404)
                .json({
                    success: false,
                    message: 
                        error instanceof Error
                        ? error.message
                        : "Failed to fetch user",
                });
        }
    }

    register = async (req: Request, res: Response) => {
        try {
            const validateData = registerSchema.parse(req.body);
            const data = await authService.registerUser(validateData);
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: data,
            });
        } catch (error) {
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
            const data = await authService.loginUser(validateData);
            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                data: data,
            });
        } catch (error) {
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