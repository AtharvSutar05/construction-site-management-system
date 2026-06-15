import type { Request, Response, NextFunction } from "express";
import { companyService } from "./company.service.js";

class CompanyController {

    getMyCompany = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const companyId = req.membership!.companyId;

            const data = await companyService.getMyCompany(companyId);

            return res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            next(error);
        }
    }

    createCompany = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.userId;
            const data = await companyService.createCompany(
                    userId, 
                    req.body
                );
            return res.status(201).json({
                success: true,
                message: "Company created successfully",
                data,
            });
        } catch(error) {
            next(error);
        }
    }

    updateCompany = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.userId;
            const companyId = req.membership!.companyId;
            const data = await companyService.updateCompany(
                userId,
                companyId,
                req.body
            );

            return res.status(200).json({
                success: true,
                message: "Company updated successfully",
                data,
            });
        } catch(error) {
            next(error);
        }
    }

    deleteCompany = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.userId;
            const companyId = req.membership!.companyId;
            await companyService.deleteCompany(
                userId,
                companyId
            );
            return res.sendStatus(204);
        } catch(error) {
            next(error);
        }
    }
}

export const companyController = new CompanyController();