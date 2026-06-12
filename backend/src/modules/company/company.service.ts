import { and, eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { companies, type Company } from "../../database/schema/companies.schema.js";
import type { CreateCompanyInput, UpdateCompanyInput } from "./company.validation.js";

class CompanyService {

    private async findCompanyByOwner(
        userId: string
    ): Promise<Company | undefined> {
        const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.createdBy, userId));

        return company;
    }

    async getMyCompany(
        userId: string
    ) {
        const existingCompany = await this.findCompanyByOwner(userId);
        if (existingCompany == undefined) {
            throw new Error("Company not found");
        }
        return existingCompany;
    }

    async createCompany(
        userId: string,
        data: CreateCompanyInput,
    ): Promise<Company> {
        const existingCompany = await this.findCompanyByOwner(userId);
        if (existingCompany) {
            throw new Error("Company already exists");
        }
        const [company] = await db
            .insert(companies)
            .values({
                name: data.name,
                description: data.description,
                createdBy: userId
            })
            .returning();

        if (!company) {
            throw new Error("Failed to create company");
        }

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