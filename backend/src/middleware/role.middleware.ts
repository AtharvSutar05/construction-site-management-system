import type { Request, Response, NextFunction } from "express";
import { companyMembers } from "../database/schema/company_members.schema.js";
import { db } from "../config/db.js";
import { eq } from "drizzle-orm";
import { UserRole } from "../shared/enums/role.enum.js";
import { NotFoundError, ForbiddenError } from "../shared/errors/index.js";

export const authorizeCompanyRole = (
  ...allowedRoles: UserRole[]
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.userId;
      const [membership] = await db
        .select({
          id: companyMembers.id,
          companyId: companyMembers.companyId,
          role: companyMembers.role
        })
        .from(companyMembers)
        .where(eq(companyMembers.userId, userId!));

      if (!membership) {
        return next(
          new ForbiddenError("Company membership required")
        );
      }

      if (!allowedRoles.includes(membership.role)) {
        return next(
          new ForbiddenError("Forbidden")
        );
      }
      req.membership = {
        memberId: membership.id,
        companyId: membership.companyId,
        role: membership.role,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};