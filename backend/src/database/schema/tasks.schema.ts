import { date, pgEnum, pgTable, text, timestamp, uuid, varchar, check, index} from "drizzle-orm/pg-core";
import { sites, companyMembers } from "./index.js";
import { TaskStatus } from "../../shared/enums/task_status.enum.js";
import { TaskPriority } from "../../shared/enums/task_priority.enum.js";
import { sql } from "drizzle-orm";

export const taskStatusPgEnum = pgEnum("task_status", [
   TaskStatus.OPEN,
   TaskStatus.IN_PROGRESS,
   TaskStatus.COMPLETED,
   TaskStatus.CANCELLED 
]);

export const taskPriorityPgEnum = pgEnum("task_priority", [
    TaskPriority.LOW,
    TaskPriority.MEDIUM,
    TaskPriority.HIGH,
    TaskPriority.CRITICAL
]);

export const tasks = pgTable(
    "tasks",
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

        title: varchar({ length: 200 })
            .notNull(),

        description: text(),

        priority: taskPriorityPgEnum()
            .default(TaskPriority.LOW)
            .notNull(),

        status: taskStatusPgEnum()
            .default(TaskStatus.OPEN)
            .notNull(),

        startDate: date("start_date"),

        dueDate: date("due_date"),

        createdBy: uuid("created_by")
            .notNull()
            .references(() => companyMembers.id, {
                onDelete: "restrict",
                onUpdate: "cascade"
            }),

        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .notNull(),

        deletedAt: timestamp("deleted_at", { withTimezone: true })
    },
    (table) => [
        check(
            "tasks_due_date_check",
            sql`
                start_date IS NULL
                OR due_date IS NULL
                OR due_date >= start_date
            `
        ),

        index("tasks_site_idx").on(table.siteId),

        index("tasks_status_idx").on(table.status),

        index("tasks_site_status_idx").on(
            table.siteId, 
            table.status
        ),

    ]
);
