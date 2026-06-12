import { Router } from "express";
import { companyController } from "./company.controller.js";

export const companyRouter = Router();

companyRouter.post(
    "/",
    companyController.createCompany
);

companyRouter.get(
    "/me",
    companyController.getMyCompany
);

companyRouter.patch(
    "/:companyId",
    companyController.updateCompany
);

companyRouter.delete(
    "/:companyId",
    companyController.deleteCompany
);