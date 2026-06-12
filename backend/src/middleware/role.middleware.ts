import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../shared/enums/role.enum.js";

export const authorize = (
  ...allowedRoles: UserRole[]
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userRole = req.headers.role; // security problem 
    if (
        !userRole ||
        !allowedRoles.includes(userRole as UserRole)
    ) {
        return res.status(403).json({
            success: false,
            message: "Access denied",
        });
    }
    return next();
  };
};