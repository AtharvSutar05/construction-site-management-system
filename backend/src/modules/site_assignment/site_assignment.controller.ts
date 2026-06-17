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

    getMembersAssignedToSite = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const companyId = req.membership!.companyId;
            const siteId = req.params.siteId as string;

            const data = await siteAssignmentService.getMembersAssignedToSite(
                companyId,
                siteId
            );

            return res.status(200)
                .json({
                    success: true,
                    data
                });
        } catch (error) {
            next(error);
        }
    }
}

export const siteAssignmentController = new SiteAssignmentController();