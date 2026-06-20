import { pgEnum, pgTable, text, uuid, timestamp, index, unique} from "drizzle-orm/pg-core";
import { dailyReports, tasks } from "./index.js";
import { SuggestedTaskStatus } from "../../shared/enums/suggested_task_status.enum.js";

export const suggestedTaskStatusPgEnum = pgEnum("suggested_status", [
    SuggestedTaskStatus.OPEN,
    SuggestedTaskStatus.IN_PROGRESS,
    SuggestedTaskStatus.PENDING,
    SuggestedTaskStatus.COMPLETED
])

export const taskProgress = pgTable(
    "task_progress",
    {
        id: uuid()
            .defaultRandom()
            .primaryKey(),

        reportId: uuid("report_id")
            .notNull()
            .references(() => dailyReports.id, {
                onDelete: "restrict",
                onUpdate: "cascade"
            }),
        
        taskId: uuid("task_id")
            .notNull()
            .references(() => tasks.id, {
                onDelete: "restrict",
                onUpdate: "cascade"
            }),
        
        suggestedStatus: suggestedTaskStatusPgEnum()
            .notNull(),

        remarks: text(),

        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        unique("task_progress_report_task_unique").on(
            table.reportId,
            table.taskId
        ),

        index("task_progress_report_idx").on(table.reportId),

        index("task_progress_task_idx").on(table.taskId),

        index("task_progress_status_idx").on(table.suggestedStatus),
    ]
)