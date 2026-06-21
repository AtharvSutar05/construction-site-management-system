import type { Request, Response, NextFunction } from "express";
import { taskService } from "./task.service.js";

class TaskController {
    createTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { memberId, companyId } = req.membership!;

            const data = await taskService.createTask(
                memberId,
                companyId,
                req.body
            );

            return res.status(201)
                .json({
                    success: true,
                    message: "Task successfully created",
                    data
                });
        } catch (error) {
            next(error);
        }
    }

    getTaskById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { companyId } = req.membership!;
            const taskId = req.params.taskId as string;

            const data = await taskService.getTaskById(
                taskId,
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

    getSiteTasks = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { companyId } = req.membership!;
            const siteId = req.params.siteId as string;

            const data = await taskService.getSiteTasks(
                siteId,
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

    updateTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { companyId } = req.membership!;
            const taskId = req.params.taskId as string;

            const data = await taskService.updateTask(
                taskId,
                companyId,
                req.body
            );

            return res.status(200)
                .json({
                    success: true,
                    message: "Task updated successfully",
                    data
                });
        } catch (error) {
            next(error);
        }
    }

    deleteTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { companyId } = req.membership!;
            const taskId = req.params.taskId as string;

            await taskService.deleteTask(
                taskId,
                companyId
            )

            return res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}

export const taskController = new TaskController();