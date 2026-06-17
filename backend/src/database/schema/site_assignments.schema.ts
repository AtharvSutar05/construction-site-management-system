import { pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { sites, companyMembers, users} from "./index.js"; 

export const siteAssignments = pgTable(
    "site_assignments", 
    {
    id: uuid()
        .defaultRandom()
        .primaryKey(),

    siteId: uuid("site_id")
        .notNull()
        .references(() => sites.id, {
            onDelete: "cascade",
        }),
    
    companyMemberId: uuid("company_member_id")
        .notNull()
        .references(() => companyMembers.id, {
            onDelete: "cascade",
        }),

    assignedBy: uuid("assigned_by")
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),

    assignedAt: timestamp("assigned_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    },
    (table) => [
        unique("site_assignments_site_member_unique").on(
            table.siteId,
            table.companyMemberId
        ),
    ]
);

export type SiteAssignments = typeof siteAssignments.$inferSelect;
export type NewSiteAssignments = typeof siteAssignments.$inferInsert;