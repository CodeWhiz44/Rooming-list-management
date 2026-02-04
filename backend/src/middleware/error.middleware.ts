import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export interface AppError extends Error {
    statusCode?: number;
}

export class ValidationError extends Error {
    constructor(public errors: ZodError["errors"]) {
        super("Validation error");
        this.name = "ValidationError";
    }
}

export function errorHandler(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error("[Error]", {
        message: error.message,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
    });

    // Zod validation error
    if (error instanceof ZodError) {
        const formatted = error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));
        res.status(400).json({
            error: "Validation Error",
            details: formatted,
        });
        return;
    }

    // Custom validation error
    if (error instanceof ValidationError) {
        const formatted = error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));
        res.status(400).json({
            error: "Validation Error",
            details: formatted,
        });
        return;
    }

    // Custom app errors
    if (error instanceof Error && error.name === "AppError") {
        const statusCode = (error as AppError).statusCode || 500;
        res.status(statusCode).json({
            error: error.message,
        });
        return;
    }

    // Prisma errors
    if (error.code === "P2025") {
        res.status(404).json({ error: "Resource not found" });
        return;
    }

    if (error.code === "P2002") {
        res.status(409).json({
            error: `Unique constraint failed: ${error.meta?.target?.[0] || "unknown field"}`,
        });
        return;
    }

    // Default error
    res.status(error.statusCode || 500).json({
        error: error.message || "Internal server error",
    });
}
