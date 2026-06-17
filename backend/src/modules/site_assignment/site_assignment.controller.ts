import type { Request, Response, NextFunction } from "express"
import { siteAssignmentService } from "./site_assignment.service.js";

class SiteAssignmentController {
    assignSiteToMember = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.userId;
            const companyId = req.membership!.companyId;
            const data = await siteAssignmentService.assignSiteToMember(
                userId,
                companyId,
                req.body
            );
            return res.status(201)
                .json({
                    success: true,
                    message: "Successfully assigned site to member",
                    data
                });
        } catch (error) {
            next(error);
        }
    }
}

export const siteAssignmentController = new SiteAssignmentController();