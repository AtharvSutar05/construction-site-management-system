import { Router } from "express";
import { authorizeCompanyRole } from "../../middleware/role.middleware.js";
import { UserRole } from "../../shared/enums/role.enum.js";
import { validateSchema } from "../../middleware/validate_schema.middleware.js";
import { inviteMemberSchema } from "./company_member.validation.js";
import { companyMemeberController } from "./company_member.controller.js";
import { validateUUID } from "../../middleware/validateUUID.middleware.js";
export const companyMemberRouter = Router();

companyMemberRouter.post(
    "/",
    authorizeCompanyRole(UserRole.ADMIN),
    validateSchema(inviteMemberSchema),
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
    validateUUID("memberId"),
    authorizeCompanyRole(UserRole.ADMIN),
    companyMemeberController.updateMemberRole
);

companyMemberRouter.delete(
    "/:memberId",
    validateUUID("memberId"),
    authorizeCompanyRole(UserRole.ADMIN),
    companyMemeberController.deleteMember
);

