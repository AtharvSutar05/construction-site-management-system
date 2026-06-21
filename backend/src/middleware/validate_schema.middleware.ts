import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validateSchema =
    (schema: ZodSchema) =>
    (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
            });
        }
    };