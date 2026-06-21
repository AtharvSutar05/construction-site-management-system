import { NotFoundError } from "../../shared/errors/not_found.error.js";
import { taskRepository } from "./task.repository.js";
import type { CreateTaskInput, UpdateTaskInput } from "./task.validation.js";
import { siteRepository } from "../site/site.repository.js";

class TaskService {

    private async ensureTaskExists(
        taskId: string,
        companyId: string
    ) {
        const task = await taskRepository.findTaskId(
            taskId,
            companyId
        );

        if (!task) {
            throw new NotFoundError("Task not found");
        }

        return task;
    }

    async createTask(
        memberId: string,
        companyId: string,
        data: CreateTaskInput
    ) {
        const existingSite = await siteRepository.findSiteId(
            data.siteId,
            companyId
        );
        
        if(!existingSite) {
            throw new NotFoundError("Site not found");
        }

        const result = await taskRepository.createTask(
            data, 
            memberId
        );

        return result;
    }

    async getTaskById(
        taskId: string,
        companyId: string
    ) {
        const task = await taskRepository.findTaskById(taskId, companyId);
        if(!task) {
            throw new NotFoundError("Task not found");
        }
        return task;
    }

    async getSiteTasks(
        siteId: string,
        companyId: string
    ) {
        const existingSite = await siteRepository.findSiteId(
            siteId,
            companyId
        );
        if(!existingSite) {
            throw new NotFoundError("Site not found");
        }
        const siteTasks = await taskRepository.findSiteTasks(siteId);
        return siteTasks;
    }

    async updateTask(
        taskId: string,
        companyId: string,
        data: UpdateTaskInput
    ) {
        await this.ensureTaskExists(taskId, companyId);

        return taskRepository.updateTask(
            data,
            taskId
        );
    }

    async deleteTask(
        taskId: string,
        companyId: string
    ) {
        await this.ensureTaskExists(taskId, companyId);

        return taskRepository.softDeleteTask(taskId);
    }
}

export const taskService = new TaskService();