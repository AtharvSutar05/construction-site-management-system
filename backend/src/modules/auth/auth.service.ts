import { eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { users, type NewUser } from "../../database/schema/users.schema.js";
import type { LoginUserInput, RegisterUserInput } from "./auth.types.js";
import bcrypt from "bcryptjs";
import { AUTH_CONSTANTS } from "../../shared/constants/auth.constants.js";
import { generateToken } from "../../shared/utils/jwt.util.js";

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

    async loginUser(data: LoginUserInput) {
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, data.email));
        if (!existingUser) {
            throw new Error("Invalid credentials");
        }
        const authorizedUser = await bcrypt.compare(data.password, existingUser.password);
        if (!authorizedUser) {
            throw new Error("Invalid credentials");
        } else {
            const token = generateToken({
                userId: existingUser.id,
                role: existingUser.role
            });
            return {
                token,
                user: {
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                },
            };
        }
    }
}

export const authService = new AuthService();