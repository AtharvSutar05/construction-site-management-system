import { Router } from "express";
import { authorizeCompanyRole } from "../../middleware/role.middleware.js";
import { UserRole } from "../../shared/enums/role.enum.js";
import { validate } from "../../middleware/validate.middleware.js";
import { inviteMemberSchema } from "./company_member.validation.js";
import { companyMemeberController } from "./company_member.controller.js";
import { validateUUID } from "../../middleware/validateUUID.middleware.js";
export const companyMemberRouter = Router();

companyMemberRouter.post(
    "/",
    authorizeCompanyRole(UserRole.ADMIN),
    validate(inviteMemberSchema),
    companyMemeberController.inviteMember
);

companyMemberRouter.get(
    "/",
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.ENGINEER
    ),
    companyMemeberController.getCompanyMembers
);

companyMemberRouter.patch(
    "/:memberId",
    authorizeCompanyRole(UserRole.ADMIN),
    validateUUID("memberId"),
    companyMemeberController.updateMemberRole
);

companyMemberRouter.delete(
    "/:memberId",
    authorizeCompanyRole(UserRole.ADMIN),
    validateUUID("memberId"),
    companyMemeberController.deleteMember
);

