import { AppError } from "./app_error.js";

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}