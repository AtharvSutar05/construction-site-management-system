import type { CreateSiteInput, UpdateSiteInput } from "./site.validation.js";
import { sites } from "../../database/schema/index.js";
import { db } from "../../database/db.js";
import { and, eq } from "drizzle-orm";
import { ConflictError } from "../../shared/errors/conflict.error.js";
import { NotFoundError } from "../../shared/errors/not_found.error.js";

class SiteService {


    private async checkSiteCode(
        companyId: string,
        siteCode: string,
        excludeSiteId?: string
    ) {
        const [existingSite] = await db
            .select({
                id: sites.id,
            })
            .from(sites)
            .where(
                and(
                    eq(sites.code, siteCode),
                    eq(sites.companyId, companyId)
                )
            );

        if(existingSite && existingSite.id !== excludeSiteId) {
            throw new ConflictError("Site code already exists");
        }
    }

    async getCompanySites(
        companyId: string
    ) {
        return await db
            .select()
            .from(sites)
            .where(
                eq(sites.companyId, companyId)
            );
    }

    async getCompanySiteById(
        companyId: string,
        siteId: string
    ) {
        const [companySite] = await db
            .select()
            .from(sites)
            .where(
                and(
                    eq(sites.companyId, companyId),
                    eq(sites.id, siteId)
                )
            );
        if(!companySite) {
            throw new NotFoundError("Site not found");
        }
        return companySite;
    }

    async createSite(
        userId: string,
        companyId: string,
        data: CreateSiteInput
    ) {
        await this.checkSiteCode(
            companyId,
            data.code
        );
        const [site] = await db
            .insert(sites)
            .values({
                ...data,
                companyId,
                createdBy: userId
            })
            .returning();
        if (!site) {
            throw new Error("Failed to create site");
        }
        return site;
    }

    async updateSite(
        companyId: string,
        siteId: string,
        data: UpdateSiteInput
    ) {
        if (data.code) {
            await this.checkSiteCode(
                companyId,
                data.code,
                siteId
            );
        }
        const [updatedSite] = await db
            .update(sites)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(sites.id, siteId),
                    eq(sites.companyId, companyId)
                )
            )
            .returning();

        if(!updatedSite) {
            throw new NotFoundError("Site not found");
        }
        return updatedSite;
    }

    async deleteSite(
        companyId: string,
        siteId: string
    ) {
        const [deletedSite] = await db
            .delete(sites)
            .where(
                and(
                    eq(sites.id, siteId),
                    eq(sites.companyId, companyId)
                )
            )
            .returning();
            if(!deletedSite) {
                throw new NotFoundError("Site not found");
            }
    }
}

export const siteService = new SiteService();