import type { Request, Response, NextFunction } from "express";
import { companyMemberSevice } from "./company_member.service.js";

class CompanyMemberController {

    getCompanyMembers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const companyId = req.membership!.companyId;
            const data = await companyMemberSevice
                .getCompanyMembers(
                    companyId
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

    inviteMember = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const companyId = req.membership!.companyId;
            const data = await companyMemberSevice
                .inviteCompanyMember(
                    companyId,
                    req.body
                );
            return res.status(201)
                .json({
                    success: true,
                    message: "Member added successfully",
                    data
                });
        } catch (error) {
            next(error);
        }
    }

    updateMemberRole = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.userId;
            const companyId = req.membership!.companyId;
            const memberId = req.params.memberId as string;
            const data = await companyMemberSevice
                .updateMemberRole(
                    userId,
                    companyId,
                    memberId,
                    req.body
                );

            return res.status(200).json({
                success: true,
                message: "Member role updated successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    }

    deleteMember = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.userId;
            const companyId = req.membership!.companyId;
            const memberId  = req.params.memberId as string;
            await companyMemberSevice
                .deleteMember(
                    userId,
                    companyId,
                    memberId
                );
            return res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}

export const companyMemeberController = new CompanyMemberController();