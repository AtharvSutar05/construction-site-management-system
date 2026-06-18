import { db } from "../../config/db.js";
import { users, sites, siteAssignments, companyMembers } from "../../database/schema/index.js";
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

        return siteAssignment;
    }

    async getMembersAssignedToSite(
        companyId: string,
        siteId: string
    ) {
        const [site] = await db
            .select({id: sites.id})
            .from(sites)
            .where(
                and(
                    eq(sites.id, siteId),
                    eq(sites.companyId, companyId)
                )
            );
        if(!site) {
            throw new NotFoundError("Site not found");
        }
        const assignedMembers = await db
            .select({
                id: siteAssignments.id,
                companyMemberId: siteAssignments.companyMemberId,
                name: users.name,
                email: users.email,
                role: companyMembers.role,
                assignedAt: siteAssignments.assignedAt
            })
            .from(siteAssignments)
            .innerJoin(
                companyMembers,
                eq(siteAssignments.companyMemberId, companyMembers.id)
            )
            .innerJoin(
                users,
                eq(companyMembers.userId, users.id)
            )
            .where(eq(siteAssignments.siteId, siteId));

        return assignedMembers;
    }

    async getSitesAssignedToMember(
        memberId: string,
        companyId: string,
    ) {
        const assignedSites = await db
            .select({
                assignmentId: siteAssignments.id,
                siteId: sites.id,
                name: sites.name,
                description: sites.description,
                assignedBy: siteAssignments.assignedBy,
                assigneAt: siteAssignments.assignedAt
            })
            .from(siteAssignments)
            .innerJoin(
                sites,
                eq(siteAssignments.siteId, sites.id)
            )
            .where(
                and(
                    eq(siteAssignments.companyMemberId, memberId),
                    eq(sites.companyId, companyId)
                )
            );

        return assignedSites;
    }

    async unassignSiteFromMember(
        assignmentId: string,
        companyId: string
    ) {
        const [assignment] = await db
            .select({
                id: siteAssignments.id,
            })
            .from(siteAssignments)
            .innerJoin(
                sites,
                eq(siteAssignments.siteId, sites.id)
            )
            .where(
                and(
                    eq(siteAssignments.id, assignmentId),
                    eq(sites.companyId, companyId)
                )
            );

        if (!assignment) {
            throw new NotFoundError("Site assignment not found");
        }

        const [deletedAssignment] = await db
            .delete(siteAssignments)
            .where(eq(siteAssignments.id, assignmentId))
            .returning();

        return deletedAssignment;
    }
}

export const siteAssignmentService = new SiteAssignmentService();