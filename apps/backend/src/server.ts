import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import informationRouter from './routes/information.routes';
import { errorHandler as globalErrorHandler } from './middlewares/error-handler.middleware';
import PinoLogger from './utils/logger/pinoLogger';
import { Config } from './utils/config';

export class Server {
  public app: Application;
  private readonly port: number | string;
  private readonly logger: PinoLogger;

  constructor(port?: number | string) {
    this.app = express();
    this.port = port || Config.PORT;
    this.logger = PinoLogger.getInstance();

    this.registerMiddlewares();
    this.registerRoutes();
    this.registerErrorHandler();
  }

  private registerMiddlewares() {
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: Config.CORS_ORIGIN,
      }),
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private registerRoutes() {
    this.app.use('/', informationRouter);
  }

  private registerErrorHandler() {
    // Error handler registered after routes
    this.app.use(globalErrorHandler);
  }

  public start(callback?: () => void) {
    const boundCallback = callback ?? (() => this.logger.info('Server running', { port: this.port }));
    this.app.listen(this.port as number, boundCallback);
  }
}

export default Server;