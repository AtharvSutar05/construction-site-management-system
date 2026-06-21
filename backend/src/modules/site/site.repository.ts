import { db } from "../../config/db.js";
import { sites } from "../../database/schema/sites.schema.js";
import { and, eq } from "drizzle-orm";

class SiteRepository {
    async findSiteId(
        siteId: string,
        companyId: string
    ) {
        const [site] = await db
            .select({
                id: sites.id,
                companyId: sites.companyId
            })
            .from(sites)
            .where(
                and(
                    eq(sites.id, siteId),
                    eq(sites.companyId, companyId)
                )
            );

        return site;
    }
}

export const siteRepository = new SiteRepository();