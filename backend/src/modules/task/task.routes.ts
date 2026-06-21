import { Router } from "express";
import { authorizeCompanyRole } from "../../middleware/role.middleware.js";
import { UserRole } from "../../shared/enums/role.enum.js";
import { validateSchema } from "../../middleware/validate_schema.middleware.js";
import { createTaskSchema, updateTaskSchema } from "./task.validation.js";
import { taskController } from "./task.controller.js";
import { validateUUID } from "../../middleware/validateUUID.middleware.js";

export const taskRouter = Router();

taskRouter.post(
    "/",
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER
    ),
    validateSchema(createTaskSchema),
    taskController.createTask
);

taskRouter.get(
    "/:taskId",
    validateUUID("taskId"),
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER,
        UserRole.ENGINEER
    ),
    taskController.getTaskById
);

taskRouter.patch(
    "/:taskId",
    validateUUID("taskId"),
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER
    ),
    validateSchema(updateTaskSchema),
    taskController.updateTask
);

taskRouter.delete(
    "/:taskId",
    validateUUID("taskId"),
    authorizeCompanyRole(
        UserRole.ADMIN,
        UserRole.MANAGER
    ),
    taskController.deleteTask
);