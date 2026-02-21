import type { NextFunction, Request, Response } from "express";
import { logger } from "@/utils/logger";

export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code: string = "INTERNAL_ERROR",
        public isOperational: boolean = true
    ) {
        super(message);
        this.name = "AppError";
    }
}

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof AppError) {
        logger.warn(
            { code: err.code, statusCode: err.statusCode },
            err.message
        );

        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
        });
        return;
    }

    // Unexpected errors
    logger.error({ error: err }, "Unhandled error");

    res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
    });
};
