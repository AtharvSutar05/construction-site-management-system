import { z } from "zod";
import { UserRole } from "../../shared/enums/role.enum.js";

const roles = Object.values(UserRole) as [
  UserRole,
  ...UserRole[]
];

export const inviteMemberSchema = z.object({
  email: z.email("Invalid email"),
  role: z.enum(roles),  
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const updateMemberRoleSchema = z.object({
  role: z.enum(roles),
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;



