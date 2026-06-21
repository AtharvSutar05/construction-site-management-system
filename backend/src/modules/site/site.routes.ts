import { Router } from "express";
import { authorizeCompanyRole } from "../../middleware/role.middleware.js";
import { UserRole } from "../../shared/enums/role.enum.js";
import { validateSchema } from "../../middleware/validate_schema.middleware.js";
import { createSiteSchema, updateSiteSchema } from "./site.validation.js";
import { siteController } from "./site.controller.js";
import { validateUUID } from "../../middleware/validateUUID.middleware.js";
import { taskController } from "../task/task.controller.js";

export const siteRouter = Router();

siteRouter.get(
    "/",
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.ENGINEER
    ),
    siteController.getCompanySites
);

siteRouter.get(
    "/:siteId",
    validateUUID("siteId"),
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.ENGINEER
    ),
    siteController.getCompanySiteById
)

siteRouter.post(
    "/",
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER
    ),
    validateSchema(createSiteSchema),
    siteController.createSite
);

siteRouter.patch(
    "/:siteId",
    validateUUID("siteId"),
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER
    ),
    validateSchema(updateSiteSchema),
    siteController.updateSite
);

siteRouter.delete(
    "/:siteId",
    validateUUID("siteId"),
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER
    ),
    siteController.deleteSite
);

siteRouter.get(
    "/:siteId/tasks",
    validateUUID("siteId"),
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.ENGINEER
    ),
    taskController.getSiteTasks
);