import { z } from "zod";

import { TaskPriority } from "../../shared/enums/task_priority.enum.js";
import { TaskStatus } from "../../shared/enums/task_status.enum.js";

export const createTaskSchema = z
    .object({
        siteId: z.uuid("Invalid site id."),

        title: z
            .string()
            .trim()
            .min(1, "Title is required.")
            .max(200, "Title cannot exceed 200 characters."),

        description: z
            .string()
            .trim()
            .max(2000, "Description cannot exceed 2000 characters.")
            .optional(),

        priority: z
            .enum(TaskPriority)
            .optional(),

        startDate: z
            .iso
            .date()
            .optional(),

        dueDate: z
            .iso
            .date()
            .optional(),
    })
    .refine(
        (data) => {
            if (!data.startDate || !data.dueDate) {
                return true;
            }

            return (
                new Date(data.dueDate) >=
                new Date(data.startDate)
            );
        },
        {
            message: "Due date cannot be before start date.",
            path: ["dueDate"],
        }
    );

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "Title is required.")
            .max(200, "Title cannot exceed 200 characters.")
            .optional(),

        description: z
            .string()
            .trim()
            .max(2000, "Description cannot exceed 2000 characters.")
            .optional(),

        priority: z
            .enum(TaskPriority)
            .optional(),

        status: z
            .enum(TaskStatus)
            .optional(),

        startDate: z
            .iso
            .date()
            .optional(),

        dueDate: z
            .iso
            .date()
            .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided.",
        }
    )
    .refine(
        (data) => {
            if (!data.startDate || !data.dueDate) {
                return true;
            }

            return (
                new Date(data.dueDate) >=
                new Date(data.startDate)
            );
        },
        {
            message: "Due date cannot be before start date.",
            path: ["dueDate"],
        }
    );

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const taskIdParamsSchema = z.object({
    taskId: z.uuid(),
});

export const siteIdParamsSchema = z.object({
    siteId: z.uuid(),
});