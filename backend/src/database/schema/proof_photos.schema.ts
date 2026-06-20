import { pgTable, text, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { taskProgress } from "./task_progress.schema.js";

export const proofPhotos = pgTable(
    "proof_photos",
    {
        id: uuid()
            .defaultRandom()
            .primaryKey(),
        
        taskProgressId: uuid("task_progress_id")
            .notNull()
            .references(() => taskProgress.id, {
                onDelete: "cascade"
            }),
        
        imageUrl: text()
            .notNull(),

        caption: text(),
        
        createdAt: timestamp("created_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("proof_photos_task_progress_idx").on(table.taskProgressId)
    ]
);