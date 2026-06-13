import { pgTable, uuid, timestamp, pgEnum} from "drizzle-orm/pg-core";
import { users, companies } from "./index.js";
import { UserRole } from "../../shared/enums/role.enum.js";

export const companyRoleEnum = pgEnum("company_role", [
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.ENGINEER,
]);

export const companyMembers = pgTable("company_members", {
    id: uuid("id")
        .defaultRandom()
        .primaryKey(),
    
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade"
        }),

    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id, {
            onDelete: "cascade"
        }),
    
    role: companyRoleEnum("role")
        .default(UserRole.ENGINEER)
        .notNull(),

    joinedAt: timestamp("joined_at", {withTimezone: false})
        .defaultNow()
        .notNull()
    
});

export type CompanyMember = typeof companyMembers.$inferSelect;
export type NewCompanyMember = typeof companyMembers.$inferInsert;