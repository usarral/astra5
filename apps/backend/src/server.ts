import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';

export class Server {
    public app: Application;
    private readonly port: number | string;

    constructor(port?: number | string) {
        this.app = express();
        this.port = port || process.env.PORT || 3000;
        this.middlewares();
        this.routes();
        this.errorHandler();
    }

    private middlewares() {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({ message: 'API is running' });
        });
    }

    private errorHandler() {
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    public start(callback?: () => void) {
        this.app.listen(this.port, callback || (() => {
            console.log(`Server running on port ${this.port}`);
        }));
    }
}

export default Server;