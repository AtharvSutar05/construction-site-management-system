import { Router } from "express";
import { siteAssignmentController } from "./site_assignment.controller.js";
import { authorizeCompanyRole } from "../../middleware/role.middleware.js";
import { UserRole } from "../../shared/enums/role.enum.js";
import { validateSchema } from "../../middleware/validate_schema.middleware.js";
import { createSiteAssignmentSchema } from "./site_assignment.validation.js";
import { validateUUID } from "../../middleware/validateUUID.middleware.js";

export const siteAssignmentRouter = Router();

siteAssignmentRouter.post(
    "/",
    authorizeCompanyRole(UserRole.ADMIN),
    validateSchema(createSiteAssignmentSchema),
    siteAssignmentController.assignSiteToMember
);

siteAssignmentRouter.get(
    "/:siteId",
    validateUUID("siteId"),
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.ENGINEER
    ),
    siteAssignmentController.getMembersAssignedToSite
);

siteAssignmentRouter.get(
    "/",
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.ENGINEER
    ),
    siteAssignmentController.getSitesAssignedToMember
);