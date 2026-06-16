import { pgTable, uuid, text, varchar, timestamp, pgEnum, doublePrecision, unique, index } from "drizzle-orm/pg-core";
import { companies, users } from "./index.js";
import { SiteStatus } from "../../shared/enums/site_status.enum.js";

export const siteStatusEnum = pgEnum("site_status", [
    SiteStatus.ACTIVE,
    SiteStatus.ON_HOLD,
    SiteStatus.COMPLETED,
    SiteStatus.ARCHIVED,
]);

export const sites = pgTable(
    "sites",
    {
        id: uuid()
            .defaultRandom()
            .primaryKey(),

        companyId: uuid()
            .notNull()
            .references(() => companies.id, {
                onDelete: "cascade",
            }),

        name: varchar({ length: 150 })
            .notNull(),

        code: varchar({ length: 50 })
            .notNull(),

        description: text(),

        address: text().notNull(),

        city: varchar({ length: 100 })
            .notNull(),

        state: varchar({ length: 100 })
            .notNull(),

        country: varchar({ length: 100 })
            .notNull(),

        latitude: doublePrecision(),

        longitude: doublePrecision(),

        status: siteStatusEnum()
            .default(SiteStatus.ACTIVE)
            .notNull(),

        createdBy: uuid()
            .notNull()
            .references(() => users.id),

        createdAt: timestamp({ withTimezone: true })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp({ withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("company_site_code_unique").on(
            table.companyId,
            table.code
        ),
        index("sites_company_idx").on(table.companyId),
    ]
);

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;