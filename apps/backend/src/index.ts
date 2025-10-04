import { Server } from "./server";
import logger from "@/utils/pino";

const PORT = Number(process.env.PORT ?? 3000);

async function start() {
    const serverLogger = logger.child({ subsystem: "http-server" });

    try {
        const app = new Server(PORT).app;

        const server = app.listen(PORT, () => {
            serverLogger.info("Server listening", { port: PORT, env: process.env.NODE_ENV });
        });

        server.on("error", (err: Error & { code?: string }) => {
            serverLogger.error(err, { message: "Server error on listen", code: err.code });
            // If the error is EADDRINUSE, exit with non-zero so orchestration can handle it
            process.exit(1);
        });
    } catch (err) {
        serverLogger.fatal(err as Error, { message: "Failed to start server" });
        process.exit(1);
    }
}

start();