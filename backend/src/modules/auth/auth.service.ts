import { eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { users, type NewUser } from "../../database/schema/users.schema.js";
import type { RegisterUserInput } from "./auth.types.js";
import bcrypt from "bcryptjs";
import { AUTH_CONSTANTS } from "../../shared/constants/auth.constants.js";

class AuthService {
    async registerUser(data: RegisterUserInput) {
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, data.email));

        if (existingUser) {
            throw new Error("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(
            data.password,
            AUTH_CONSTANTS.SALT_ROUNDS
        );
        const newUser: NewUser = {
            name: data.name,
            email: data.email,
            password: hashedPassword
        };

        const [user] = await db
            .insert(users)
            .values(newUser)
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                createdAt: users.createdAt,
            });
        return user;
    }
}

export const authService = new AuthService();