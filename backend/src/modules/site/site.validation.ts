import { z } from "zod";
import { SiteStatus } from "../../shared/enums/site_status.enum.js";

const siteStatus = Object.values(SiteStatus) as [
    SiteStatus,
    ...SiteStatus[]
]

export const createSiteSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Site name must be at least 3 characters")
        .max(150, "Site name cannot exceed 150 characters"),

    code: z
        .string()
        .trim()
        .uppercase()
        .min(1, "Site code is required")
        .max(50, "Site code cannot exceed 50 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),

    address: z
        .string()
        .trim()
        .min(5, "Address is required")
        .max(500, "Address cannot exceed 500 characters"),

    city: z
        .string()
        .trim()
        .min(2, "City is required")
        .max(100, "City cannot exceed 100 characters"),

    state: z
        .string()
        .trim()
        .min(2, "State is required")
        .max(100, "State cannot exceed 100 characters"),

    country: z
        .string()
        .trim()
        .min(2, "Country is required")
        .max(100, "Country cannot exceed 100 characters"),

    latitude: z
        .number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
        .optional(),

    longitude: z
        .number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
        .optional(),

    status: z
        .enum(siteStatus)
        .optional(),
});

export const updateSiteSchema = createSiteSchema.partial();

export type CreateSiteInput = z.infer<typeof createSiteSchema>;
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>;