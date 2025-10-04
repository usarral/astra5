import { AstraError } from "@/AstraError";
import { NextFunction, Request, Response } from "express";
import logger from "@/utils/pino";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AstraError) {
        const serializeErrors = err.serializeErrors();
        return res.status(400).send({ errors: serializeErrors });
    }
        res.status(500).send({ errors: [{ message: "Something went wrong" }] });
        // Log the error with request context when available
        try {
            logger.error(err, { path: req.path, method: req.method, body: req.body });
        } catch (e) {
            // Fallback to console if logger fails for any reason
            // eslint-disable-next-line no-console
            console.error("Error logging failed", e);
        }
}