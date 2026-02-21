import { logger } from "@/utils/logger";
import { envs } from "@/config/env";
import { pool } from "@/config/database";
import createApp from "./app";
import type { Server } from "node:http";

let server: Server;

const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutdown signal received, closing gracefully...");

    // Stop accepting new connections
    server?.close(() => {
        logger.info("HTTP server closed.");
    });

    // Close database pool
    try {
        await pool.end();
        logger.info("Database pool closed.");
    } catch (err) {
        logger.error({ error: err }, "Error closing database pool.");
    }

    process.exit(0);
};

const main = async () => {
    try {
        const port = envs.PORT;
        const envType = envs.NODE_ENV;
        const app = createApp();
        server = app.listen(port, () => {
            logger.info(
                {
                    PORT: port,
                    ENVIRONMENT: envType,
                },
                `Server is running.`,
            );
        });
    } catch (error) {
        logger.error({ error }, "Failed to start the server.");
        process.exit(1);
    }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

void main();
