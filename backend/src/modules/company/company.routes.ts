import { Router } from "express";
import { companyController } from "./company.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createCompanySchema, updateCompanySchema } from "./company.validation.js";

export const companyRouter = Router();

companyRouter.post(
    "/",
    validate(createCompanySchema),
    companyController.createCompany
);

companyRouter.get(
    "/me",
    companyController.getMyCompany
);

companyRouter.patch(
    "/:companyId",
    validate(updateCompanySchema),
    companyController.updateCompany
);

companyRouter.delete(
    "/:companyId",
    companyController.deleteCompany
);