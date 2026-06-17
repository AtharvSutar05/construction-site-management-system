import { Router } from "express";
import { companyController } from "./company.controller.js";
import { validateSchema } from "../../middleware/validate_schema.middleware.js";
import { createCompanySchema, updateCompanySchema } from "./company.validation.js";
import { authorizeCompanyRole } from "../../middleware/role.middleware.js";
import { UserRole } from "../../shared/enums/role.enum.js";

export const companyRouter = Router();

companyRouter.post(
    "/",
    validateSchema(createCompanySchema),
    companyController.createCompany
);

companyRouter.get(
    "/me",
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.ENGINEER
    ),
    companyController.getMyCompany
);

companyRouter.patch(
    "/",
    authorizeCompanyRole(UserRole.ADMIN),
    validateSchema(updateCompanySchema),
    companyController.updateCompany
);

companyRouter.delete(
    "/",
    authorizeCompanyRole(UserRole.ADMIN),
    companyController.deleteCompany
);