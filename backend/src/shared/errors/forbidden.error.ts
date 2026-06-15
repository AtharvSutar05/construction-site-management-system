import { AppError } from "./app_error.js";

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}