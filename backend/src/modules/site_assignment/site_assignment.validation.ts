import { z } from "zod";

export const createSiteAssignmentSchema = z.object({
    siteId: z
        .uuid("Invalid site id"),
        
    companyMemberId: z
        .uuid("Invalid company member id"),
}).strict();

export type CreateSiteAssignmentInput = z.infer<typeof createSiteAssignmentSchema>;
