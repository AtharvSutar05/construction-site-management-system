import { eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { users, type NewUser } from "../../database/schema/users.schema.js";
import type { LoginUserInput, RegisterUserInput } from "./auth.types.js";
import bcrypt from "bcryptjs";
import { AUTH_CONSTANTS } from "../../shared/constants/auth.constants.js";
import { generateToken } from "../../shared/utils/jwt.util.js";

class AuthService {

    async getCurrentUser(userId: string) {
        const [user] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email
            })
            .from(users)
            .where(eq(users.id, userId));

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

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
                email: users.email
            });
        if(!user) {
            throw new Error("Failed to register");
        }
        const token = generateToken({
            userId: user.id
        })
        return {
            token,
            user
        };
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
        } 
        const token = generateToken({
            userId: existingUser.id
        });
        return {
            token,
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email
            },
        };
    }
}

export const authService = new AuthService();