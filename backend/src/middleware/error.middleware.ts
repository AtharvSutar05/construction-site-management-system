import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../shared/errors/index.js";

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.flatten(),
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}