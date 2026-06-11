import { UserRole } from "../../shared/enums/role.enum.js";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}