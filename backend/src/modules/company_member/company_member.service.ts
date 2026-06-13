import type { InviteMemberInput, UpdateMemberRoleInput } from "./company_member.validation.js";
import { users, companyMembers } from "../../database/schema/index.js";
import { db } from "../../database/db.js";
import {eq } from "drizzle-orm";

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
            throw new Error("User does not exist");
        }
        const [existingMember] = await db
            .select()
            .from(companyMembers)
            .where(eq(companyMembers.userId, user.id));
        
        if(existingMember) {
            throw new Error("User is already a member of company");
        }
        const newCompanyMember = await db   
            .insert(companyMembers)
            .values({
                userId: user.id,
                companyId: companyId,
                role: data.role
            })
            .returning();
        return newCompanyMember;
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
            .where(eq(companyMembers.id, memberId));

        if(!member) {
            throw new Error("Member not found");
        }

        if(member.companyId !== companyId) {
            throw new Error("Member not found");
        }
        if (member.userId === currentUserId) {
            throw new Error(
                "You cannot change your own role"
            );
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
            .where(eq(companyMembers.id, memberId));

        if(!member) {
            throw new Error("Member not found");
        }
        if(member.companyId !== companyId) {
            throw new Error("Member not found");
        }
        if (member.userId === currentUserId) {
            throw new Error(
                "You cannot remove your own membership"
            );
        }
        const [deletedMember] = await db
            .delete(companyMembers)
            .where(eq(companyMembers.id, memberId))
            .returning();
        return deletedMember;
    }
}

export const companyMemberSevice = new CompanyMemberSevice();