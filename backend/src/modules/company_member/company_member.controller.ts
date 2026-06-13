import type { Request, Response } from "express";
import { companyMemberSevice } from "./company_member.service.js";

class CompanyMemberController {

    getCompanyMembers = async (
        req: Request,
        res: Response
    ) => {
        try {
            if(!req.membership) {
                throw new Error("Membership not found");
            }
            const companyId = req.membership.companyId;
            const members = await companyMemberSevice
                .getCompanyMembers(
                    companyId
                );
            return res.status(200)
                .json({
                    success: true,
                    data: members
                });

        } catch(error) {
             return res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch members",
            });
        }
    }

    inviteMember = async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.membership) {
                throw new Error("Membership not found");
            }
            const companyId = req.membership.companyId;
            const newCompanyMember = await companyMemberSevice
                .inviteCompanyMember(
                    companyId,
                    req.body
                );
            return res.status(201)
                .json({
                    success: true,
                    message: "Member added successfully",
                    data: newCompanyMember
                });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to add company member",
            });
        }
    }

    updateMemberRole = async (
        req: Request,
        res: Response
    ) => {
        try {
            if(!req.membership) {
                throw new Error("Membership not found");
            }
            if(!req.user) {
                throw new Error("User not found");
            }
            const userId = req.user.userId;
            const companyId = req.membership.companyId;
            const memberId = req.params.memberId;
            if(!memberId || Array.isArray(memberId)) {
                return res.status(400).json({
                    success: false,
                    message: "Member id is required",
                });
            }
            const updatedMember = await companyMemberSevice
                .updateMemberRole(
                    userId,
                    companyId,
                    memberId,
                    req.body
                );
            
            return res.status(200).json({
                success: true,
                message: "Member role updated successfully",
                data: updatedMember,
            });
        } catch(error) {
            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update role",
            });
        }
    }

    deleteMember = async (
        req: Request,
        res: Response
    ) => {
        try {
            if(!req.membership) {
                throw new Error("Membership not found");
            }
            if(!req.user) {
                throw new Error("User not found");
            }
            const userId = req.user.userId;
            const companyId = req.membership.companyId;
            const memberId = req.params.memberId;
            if(!memberId || Array.isArray(memberId)) {
                return res.status(400).json({
                    success: false,
                    message: "Member id is required",
                });
            }
            const deletedMember = await companyMemberSevice
                .deleteMember(
                    userId,
                    companyId,
                    memberId
                );
            return res.status(200).json({
                success: true,
                message: "Member deleted successfully",
                data: deletedMember
            });
        } catch(error) {
            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete member",
            });
        }
    }
}

export const companyMemeberController = new CompanyMemberController();