import type { Request, Response, NextFunction } from "express";
import { companyMembers } from "../database/schema/company_members.schema.js";
import { db } from "../database/db.js";
import { eq } from "drizzle-orm";
import { UserRole } from "../shared/enums/role.enum.js";

export const authorizeCompanyRole = (
  ...allowedRoles: UserRole[]
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.userId;
    const [membership] = await db
      .select()
      .from(companyMembers)
      .where(eq(companyMembers.userId, userId!));

    if (!membership) {
      return next(new Error("Not a company member"));
    }

    if (!allowedRoles.includes(membership.role)) {
      return next(new Error("Forbidden"));
    }
    req.membership = {
      userId: membership.userId,
      companyId: membership.companyId,
      role: membership.role,
    };
    return next();
  };
};