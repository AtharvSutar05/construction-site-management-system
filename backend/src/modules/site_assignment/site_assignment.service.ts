import { db } from "../../database/db.js";
import { sites, siteAssignments, companyMembers } from "../../database/schema/index.js";
import { eq, and } from "drizzle-orm";
import type { CreateSiteAssignmentInput } from "./site_assignment.validation.js";
import { NotFoundError, BadRequestError, ConflictError } from "../../shared/errors/index.js";
import { UserRole } from "../../shared/enums/role.enum.js";

class SiteAssignmentService {
    async assignSiteToMember(
        userId: string,
        companyId: string,
        data: CreateSiteAssignmentInput
    ) {
        const [site] = await db
            .select({ id: sites.id })
            .from(sites)
            .where(
                and(
                    eq(sites.companyId, companyId),
                    eq(sites.id, data.siteId),
                )
            );
        if(!site) {
            throw new NotFoundError("Site not found");
        }
        const [companyMember] = await db
            .select({
                id: companyMembers.id,
                role: companyMembers.role,
            })
            .from(companyMembers)
            .where(
                and(
                    eq(companyMembers.id, data.companyMemberId),
                    eq(companyMembers.companyId, companyId)
                )
            );
        if(!companyMember) {
            throw new NotFoundError("Member not found");
        }
        if (companyMember.role === UserRole.ADMIN) {
            throw new BadRequestError("Admins cannot be assigned to sites");
        }
        const [existingSiteAssingment] = await db
            .select()
            .from(siteAssignments)
            .where(
                and(
                    eq(siteAssignments.siteId, data.siteId),
                    eq(siteAssignments.companyMemberId, data.companyMemberId)
                )
            )
        if (existingSiteAssingment) {
            throw new ConflictError("Member is already assigned to this site");
        }
        const [siteAssignment] = await db
            .insert(siteAssignments)
            .values({
                siteId: data.siteId,
                companyMemberId: data.companyMemberId,
                assignedBy: userId
            })
            .returning();
        
        if(!siteAssignment) {
            throw new Error("Failed to assign site to member");
        }
        return siteAssignment;
    }
}

export const siteAssignmentService = new SiteAssignmentService();