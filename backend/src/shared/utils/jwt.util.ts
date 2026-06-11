import jwt, { type Secret } from "jsonwebtoken";

interface JwtPayload {
    userId: string;
    role: string;
}

const secret: Secret =
    process.env.JWT_SECRET as string;

export const generateToken = (payload: JwtPayload) => {
    return jwt.sign(
        payload,
        secret,
        {
            expiresIn: "7d"
        }
    );
}