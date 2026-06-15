import type { InviteMemberInput, UpdateMemberRoleInput } from "./company_member.validation.js";
import { users, companyMembers } from "../../database/schema/index.js";
import { db } from "../../database/db.js";
import {and, eq } from "drizzle-orm";
import { ConflictError, ForbiddenError, NotFoundError } from "../../shared/errors/index.js";

class CompanyMemberSevice {
    async getCompanyMembers(
        companyId: string,
    ) {
        const members = await db
            .select({
                id: companyMembers.id,
                userId: users.id,
                name: users.name,
                email: users.email,
                role: companyMembers.role,
                joinedAt: companyMembers.joinedAt 
            })
            .from(companyMembers)
            .innerJoin(
                users,
                eq(companyMembers.userId, users.id)
            )
            .where(eq(companyMembers.companyId, companyId));
        return members;
    }

    async inviteCompanyMember(
        companyId: string,
        data: InviteMemberInput
    ) {
        const [user] = await db
            .select({
                id: users.id,
                email: users.email,
            })
            .from(users)
            .where(eq(users.email, data.email));
        if(!user) {
            throw new NotFoundError("User does not exist");
        }
        const [existingMember] = await db
            .select()
            .from(companyMembers)
            .where(eq(companyMembers.userId, user.id));
        
        if(existingMember) {
            throw new ConflictError("User is already a member of company");
        }
        const [newMember] = await db   
            .insert(companyMembers)
            .values({
                userId: user.id,
                companyId: companyId,
                role: data.role
            })
            .returning();
        return newMember;
    }

    async updateMemberRole(
        currentUserId: string,
        companyId: string,
        memberId: string,
        data: UpdateMemberRoleInput
    ) {
        const [member] = await db
            .select()
            .from(companyMembers)
            .where(
                and(
                    eq(companyMembers.id, memberId), 
                    eq(companyMembers.companyId, companyId)
                )
            );

        if(!member) {
            throw new NotFoundError("Member not found");
        }
        if (member.userId === currentUserId) {
            throw new ForbiddenError("You cannot change your own role");
        }
        const [updatedMember] = await db
            .update(companyMembers)
            .set({
                role: data.role,
            })
            .where(eq(companyMembers.id, memberId))
            .returning();
        return updatedMember;
    }

    async deleteMember(
        currentUserId: string,
        companyId: string,
        memberId: string
    ) {
        const [member] = await db
            .select()
            .from(companyMembers)
            .where(
                and(
                    eq(companyMembers.id, memberId), 
                    eq(companyMembers.companyId, companyId)
                )
            );

        if(!member) {
            throw new NotFoundError("Member not found");
        }
        if (member.userId === currentUserId) {
            throw new ForbiddenError("You cannot remove your own membership");
        }
        const [deletedMember] = await db
            .delete(companyMembers)
            .where(eq(companyMembers.id, memberId))
            .returning();
        return deletedMember;
    }
}

export const companyMemberSevice = new CompanyMemberSevice();