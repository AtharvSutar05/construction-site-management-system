import { pgTable, uuid, date, varchar, integer, text, pgEnum, timestamp, unique, check, index } from "drizzle-orm/pg-core";
import { sites, companyMembers } from "./index.js";
import { ReportStatus } from "../../shared/enums/report_status.enum.js";
import { sql } from "drizzle-orm";

export const reportStatusPgEnum = pgEnum("report_status", [
    ReportStatus.DRAFT,
    ReportStatus.SUBMITTED,
    ReportStatus.APPROVED,
    ReportStatus.REJECTED
])

export const dailyReports = pgTable(
    "daily_reports",
    {
        id: uuid()
            .defaultRandom()
            .primaryKey(),

        siteId: uuid("site_id")
            .notNull()
            .references(() => sites.id, {
                onDelete: "restrict",
                onUpdate: "cascade"
            }),

        createdBy: uuid("created_by")
            .notNull()
            .references(() => companyMembers.id, {
                onDelete: "restrict",
                onUpdate: "cascade"
            }),

        reportDate: date("report_date")
            .notNull(),
        
        weather: varchar({ length: 100 })
            .notNull(),

        manpower: integer("manpower")
            .notNull(),

        remarks: text(),
        
        status: reportStatusPgEnum()
            .default(ReportStatus.DRAFT)
            .notNull(),
        
        submittedAt: timestamp("submitted_at", {withTimezone: true}),

        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("daily_reports_site_engineer_date_unique").on(
            table.siteId,
            table.createdBy,
            table.reportDate
        ),
        check(
            "daily_reports_manpower_check",
            sql`${table.manpower} >= 0`
        ),
        check(
            "daily_reports_submission_check",
            sql`
                (
                    status = 'draft'
                    AND submitted_at IS NULL
                )
                OR
                (
                    status <> 'draft'
                    AND submitted_at IS NOT NULL
                )
            `
        ),

        index("daily_reports_site_idx").on(table.siteId),

        index("daily_reports_created_by_idx").on(table.createdBy),

        index("daily_reports_status_idx").on(table.status),

        index("daily_reports_report_date_idx").on(table.reportDate),

        index("daily_reports_site_date_idx").on(
            table.siteId,
            table.reportDate
        ),
    ]
);
