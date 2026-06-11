import jwt, { type Secret } from "jsonwebtoken";
import type { AuthPayload } from "../../modules/auth/auth.types.js";

const secret: Secret =
    process.env.JWT_SECRET as string;

export const generateToken = (payload: AuthPayload) => {
    return jwt.sign(
        payload,
        secret,
        {
            expiresIn: "7d"
        }
    );
}

export const verifyToken = (
  token: string
): AuthPayload => {
  return jwt.verify(
    token,
    secret
  ) as AuthPayload;
};