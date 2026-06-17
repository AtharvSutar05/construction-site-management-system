import type { Request, Response, NextFunction } from "express";
import { siteService } from "./site.service.js";


class SiteController {

    getCompanySites = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const companyId = req.membership!.companyId;
            const data = await siteService.getCompanySites(companyId);
            return res.status(200)
                .json({
                    success: true,
                    data
                });
        } catch(error) {
            next(error);
        }
    }

    getCompanySiteById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const companyId = req.membership!.companyId;
            const siteId = req.params.siteId as string;
            const data = await siteService.getCompanySiteById(
                companyId,
                siteId
            );
            return res.status(200)
                .json({
                    success: true,
                    data
                });
        } catch(error) {
            next(error);
        }
    }

    createSite = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.userId;
            const companyId = req.membership!.companyId;
            const data = await siteService.createSite(
                userId,
                companyId,
                req.body
            );
            return res.status(201)
                .json({
                    success: true,
                    message: "Site created successfully",
                    data
                });
        } catch (error) {
            next(error);
        }
    }

    updateSite = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const companyId = req.membership!.companyId;
            const siteId = req.params.siteId as string;
            const data = await siteService.updateSite(
                companyId,
                siteId,
                req.body
            );
            return res.status(200)
                .json({
                    success: true,
                    message: "Site updated successfully",
                    data
                })
        } catch(error) {
            next(error);
        }
    }

    deleteSite = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const companyId = req.membership!.companyId;
            const siteId = req.params.siteId as string;
            await siteService.deleteSite(
                companyId,
                siteId
            );
            return res.sendStatus(204);
        } catch(error) {
            next(error);
        }
    }
}

export const siteController = new SiteController();