import express from "express";
import type { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "@/utils/logger";
import { envs } from "@/config/env";
import { registerRoutes } from "@/routes/index";
import { errorHandler } from "@/middlewares/error.handler";

const createApp = (): Express => {
    const app: Express = express();

    // Security middlewares
    app.use(helmet());
    app.use(
        cors({
            origin: envs.CORS_ORIGIN,
            credentials: true,
        }),
    );

    // Request logging
    app.use(pinoHttp({ logger }));

    // Body parsers
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    registerRoutes(app);

    // 404 handler
    app.use((req, res) => {
        logger.warn({ url: req.originalUrl }, "Route not found");

        res.status(404).json({
            status: 404,
            message: "Sorry, we couldn't find that route!",
            path: req.originalUrl,
        });
    });

    // Global error handler (must be last)
    app.use(errorHandler);

    return app;
};

export default createApp;
