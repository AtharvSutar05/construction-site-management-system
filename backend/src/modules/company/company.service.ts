import { and, eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { companies, type Company, companyMembers } from "../../database/schema/index.js";
import type { CreateCompanyInput, UpdateCompanyInput } from "./company.validation.js";
import { UserRole } from "../../shared/enums/role.enum.js";

class CompanyService {

    async getMyCompany(
        companyId: string
    ) {
        const [company] = await db
            .select()
            .from(companies)
            .where(eq(companies.id, companyId));
        
        if (!company) {
            throw new Error("Company not found");
        }
        return company;
    }

    async createCompany(
        userId: string,
        data: CreateCompanyInput,
    ): Promise<Company> {
        const [membership] = await db
            .select()
            .from(companyMembers)
            .where(eq(companyMembers.userId, userId));

        if (membership) {
            throw new Error(
                "Already belongs to a company"
            );
        }
        const company = await db.transaction(async (tx) => {
            const [newCompany] = await tx
                .insert(companies)
                .values({
                    createdBy: userId,
                    name: data.name,
                    description: data.description
                })
                .returning();

            if(!newCompany) {
                throw new Error("Failed to create company");
            }
            
            await tx
                .insert(companyMembers)
                .values({
                    userId,
                    companyId: newCompany.id,
                    role: UserRole.ADMIN
                });

            return newCompany;
        });

        return company;
    }

    async updateCompany(
        userId: string,
        companyId: string,
        data: UpdateCompanyInput
    ) {
        const [updatedCompany] = await db
            .update(companies)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(companies.id, companyId),
                    eq(companies.createdBy, userId)
                )
            )
            .returning();
        if(!updatedCompany) {
            throw new Error("Company not found");
        }
        return updatedCompany;
    }

    async deleteCompany(
        userId: string,
        companyId: string
    ) {
        const [deletedCompany] = await db
            .delete(companies)
            .where(
                and(
                    eq(companies.id, companyId),
                    eq(companies.createdBy, userId)
                )
            )
            .returning();

        if(!deletedCompany) {
            throw new Error("Company not found");
        }
    }
}

export const companyService = new CompanyService();