import { pgEnum, pgTable, text, timestamp, unique, uuid, index } from "drizzle-orm/pg-core";
import { companyMembers, dailyReports } from "./index.js";
import { ApprovalStatus } from "../../shared/enums/approval_status.enum.js";

export const approvalStatusPgEnum = pgEnum("approval_status", [
    ApprovalStatus.APPROVED,
    ApprovalStatus.REJECTED
])

export const reportApprovals = pgTable(
    "report_approvals",
    {
        id: uuid()
            .defaultRandom()
            .primaryKey(),

        reportId: uuid("report_id")
            .notNull()
            .references(() => dailyReports.id, {
                onDelete: "restrict"
            }),

        reviewedBy: uuid("reviewed_by")
            .notNull()
            .references(() => companyMembers.id, {
                onDelete: "restrict"
            }),

        status: approvalStatusPgEnum()
            .notNull(),

        remarks: text(),

        reviewedAt: timestamp("reviewed_at", { withTimezone: true })
            .notNull(),

        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("report_approvals_report_unique").on(table.reportId),

        index("report_approvals_reviewed_by_idx").on(table.reviewedBy),

        index("report_approvals_status_idx").on(table.status),
    ]
);