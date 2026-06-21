import { db } from "../../config/db.js";
import { tasks, sites } from "../../database/schema/index.js";
import type { CreateTaskInput, UpdateTaskInput } from "./task.validation.js";
import { and, desc, eq, isNull } from "drizzle-orm";

class TaskRepository {
    async createTask(
        data: CreateTaskInput,
        createdBy: string
    ) {
        const [newTask] = await db
            .insert(tasks)
            .values({
                ...data,
                createdBy,
            })
            .returning();

        return newTask;
    }

    async findTaskId(
        taskId: string,
        companyId: string
    ) {
        const [task] = await db
            .select({
                id: tasks.id,
            })
            .from(tasks)
            .innerJoin(
                sites,
                eq(tasks.siteId, sites.id)
            )
            .where(
                and(
                    eq(tasks.id, taskId),
                    eq(sites.companyId, companyId),
                    isNull(tasks.deletedAt)
                )    
            );

        return task;
    }

    async findSiteTasks(
        siteId: string
    ) {
        const siteTasks = await db
            .select({
                id: tasks.id,
                title: tasks.title,
                priority: tasks.priority,
                status: tasks.status,
                dueDate: tasks.dueDate,
            })
            .from(tasks)
            .orderBy(desc(tasks.createdAt))
            .where(
                and(
                    eq(tasks.siteId, siteId),
                    isNull(tasks.deletedAt)
                )
            );

        return siteTasks;
    }


    async updateTask(
        data: UpdateTaskInput,
        taskId: string
    ) {
        const [updatedTask] = await db
            .update(tasks)
            .set({
                ...data,
                updatedAt: new Date()
            })
            .where(
                eq(tasks.id, taskId)
            )
            .returning();

        return updatedTask;
    }

    async softDeleteTask(
        taskId: string
    ) {
        const [softDeletedTask] = await db
            .update(tasks)
            .set({
                deletedAt: new Date(),
                updatedAt: new Date()
            })
            .where(
                eq(tasks.id, taskId)
            )
            .returning({
                id: tasks.id,
                title: tasks.title
            });
        
        return softDeletedTask;
    }

    async findTaskById(
        taskId: string,
        companyId: string
    ) {
        const [result] = await db
            .select({
                id: tasks.id,
                title: tasks.title,
                description: tasks.description,
                priority: tasks.priority,
                status: tasks.status,
                startDate: tasks.startDate,
                dueDate: tasks.dueDate,
            })
            .from(tasks)
            .innerJoin(
                sites,
                eq(tasks.siteId, sites.id)
            )
            .where(
                and(
                    eq(tasks.id, taskId),
                    eq(sites.companyId, companyId),
                    isNull(tasks.deletedAt)
                )
            );
        
        return result;
    }
}

export const taskRepository = new TaskRepository();