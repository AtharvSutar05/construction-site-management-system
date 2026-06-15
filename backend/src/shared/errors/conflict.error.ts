import { AppError } from "./app_error.js";

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}