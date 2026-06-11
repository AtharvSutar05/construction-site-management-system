import type { Request, Response, NextFunction} from "express";
import { verifyToken } from "../shared/utils/jwt.util.js";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access token required",
            });
        }
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format",
            });
        }

        const token = authHeader.split(" ")[1];
        
        const decoded = verifyToken(token!);
        
        req.user = decoded;
        
        return next();
    } catch(error) {
        return res.status(401)
            .json({
                success: false,
                message: "Invalid or expired token",
            });
    } 
}