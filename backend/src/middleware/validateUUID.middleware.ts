import type { Request, Response, NextFunction } from "express";
import { validate as isUUID } from "uuid";
import { BadRequestError } from "../shared/errors/index.js";

export const validateUUID = (paramName: string) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const value = req.params[paramName];

        if (!value) {
            return next(
                new BadRequestError(`${paramName} is required`)
            );
        }

        if (!isUUID(value)) {
            return next(
                new BadRequestError(`Invalid ${paramName}`)
            );
        }

        next();
    };
};