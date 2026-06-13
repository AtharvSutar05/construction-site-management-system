import type { Request, Response } from "express";
import { companyService } from "./company.service.js";

class CompanyController {

    getMyCompany = async (
        req: Request,
        res: Response
    ) => {
        try {
            if(!req.membership) {
                throw new Error("Membership not found");
            }
            const companyId = req.membership.companyId;

            const company = await companyService.getMyCompany(companyId);

            return res.status(200).json({
                success: true,
                data: company,
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Company not found",
            });
        }
    }

    createCompany = async(
        req: Request,
        res: Response
    ) => {
        try {
            if(!req.user) {
                throw new Error("User not found");
            }
            const userId = req.user.userId;
            const data = await companyService.createCompany(
                    userId, 
                    req.body
                );
            return res.status(201).json({
                success: true,
                message: "Company created successfully",
                data: data,
            });
        } catch(error) {
            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to create company",
            });
        }
    }

    updateCompany = async(
        req: Request,
        res: Response
    ) => {
        try {
            if(!req.user) {
                throw new Error("User not found");
            }
            if(!req.membership) {
                throw new Error("Membership not found");
            }
            const userId = req.user.userId;
            const companyId = req.membership.companyId;
            const updatedCompany = await companyService.updateCompany(
                userId,
                companyId,
                req.body
            );

            return res.status(200).json({
                success: true,
                message: "Company updated successfully",
                data: updatedCompany,
            });
        } catch(error) {
            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update company",
            });
        }
    }

    deleteCompany = async(
        req: Request,
        res: Response
    ) => {
        try {
            if(!req.user) {
                throw new Error("User not found");
            }
            if(!req.membership) {
                throw new Error("Membership not found");
            }
            const userId = req.user.userId;
            const companyId = req.membership.companyId;
            await companyService.deleteCompany(
                userId,
                companyId
            );
            return res.status(200).json({
                success: true,
                message: "Company deleted successfully",
            });
        } catch(error) {
            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete company",
            });
        }
    }
}

export const companyController = new CompanyController();