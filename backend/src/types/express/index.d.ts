import "express";
import type { UserRole } from "../../shared/enums/role.enum";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
      };
      membership?: {
        userId: string;
        companyId: string;
        role: UserRole;
      }
    }
  }
}

export {};