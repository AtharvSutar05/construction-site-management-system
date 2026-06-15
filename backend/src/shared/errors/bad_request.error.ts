import { AppError } from "./app_error.js";

export class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}