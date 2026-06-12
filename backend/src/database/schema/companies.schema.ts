import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const companies = pgTable("companies", {
    id: uuid("id")
        .defaultRandom()
        .primaryKey(),

    name: varchar("name", { length: 150 })
        .notNull(),

    description: varchar("description", { length: 500 }),

    createdBy: uuid("created_by")
        .notNull()
        .references(() => users.id),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;