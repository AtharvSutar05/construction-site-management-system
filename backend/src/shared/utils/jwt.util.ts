import jwt, { type Secret } from "jsonwebtoken";
import type { AuthPayload } from "../../modules/auth/auth.types.js";
import { env } from "../../config/env.js";

export const generateToken = (payload: AuthPayload) => {
    return jwt.sign(
        payload,
        env.JWT_SECRET,
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
    env.JWT_SECRET
  ) as AuthPayload;
};