import { z } from "zod";

export const createCompanySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Company name must be at least 2 characters")
        .max(150, "Company name cannot exceed 150 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = createCompanySchema.partial();

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;