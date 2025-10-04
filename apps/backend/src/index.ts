import { Server } from './server';
import PinoLogger from './utils/logger/pinoLogger';
import { Config } from './utils/config';

if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
}

const logger = PinoLogger.getInstance();
const serverLogger = logger.child({ subsystem: 'http-server' });

async function start() {
    try {
        const server = new Server(Config.PORT);
        server.start(() => {
            serverLogger.info('Server listening', { port: Config.PORT, env: process.env.NODE_ENV });
        });
    } catch (err) {
        serverLogger.fatal(err as Error, { message: 'Failed to start server' });
        process.exit(1);
    }
}

start();