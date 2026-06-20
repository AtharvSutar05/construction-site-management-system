import { pgEnum, pgTable, uuid, text, timestamp, unique, index } from "drizzle-orm/pg-core";
import { taskProgress } from "./index.js";
import { IssueType } from "../../shared/enums/isssue_type.enum.js";

export const issueTypePgEnum = pgEnum("issue_type", [
    IssueType.CLIENT,
    IssueType.DESIGN,
    IssueType.LABOUR,
    IssueType.MACHINE,
    IssueType.MATERIAL,
    IssueType.SAFETY,
    IssueType.WEATHER,
    IssueType.OTHER
]);

export const issues = pgTable(
    "issues",
    {
        id: uuid()
            .defaultRandom()
            .primaryKey(),

        taskProgressId: uuid("task_progress_id")
            .notNull()
            .references(() => taskProgress.id, {
                onDelete: "cascade"
            }),

        type: issueTypePgEnum()
            .notNull(),

        description: text()
            .notNull(),

        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("issues_task_progress_unique").on(table.taskProgressId),
        
        index("issues_type_idx").on(table.type)
    ]
);