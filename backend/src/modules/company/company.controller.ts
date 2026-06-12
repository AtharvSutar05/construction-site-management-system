import type { Request, Response } from "express";
import { companyService } from "./company.service.js";
import { createCompanySchema, updateCompanySchema } from "./company.validation.js";

interface CompanyParams {
    companyId: string;
}

class CompanyController {

    getMyCompany = async (
        req: Request,
        res: Response
    ) => {
        try {
            const userId = req.user!.userId;

            const company = await companyService.getMyCompany(userId);

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
            const userId = req.user!.userId;
            const validateData = createCompanySchema.parse(req.body);
            const company = await companyService.createCompany(
                    userId, 
                    validateData
                );
            return res.status(201).json({
                success: true,
                message: "Company created successfully",
                data: company,
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
        req: Request<CompanyParams>,
        res: Response
    ) => {
        try {
            const userId = req.user!.userId;
            const { companyId } = req.params;
            const validateData = updateCompanySchema.parse(req.body);
            const updatedCompany = await companyService.updateCompany(
                userId,
                companyId,
                validateData
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
        req: Request<CompanyParams>,
        res: Response
    ) => {
        try {
            const userId = req.user!.userId;
            const {companyId} = req.params;
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