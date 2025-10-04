export class Config {
    static readonly PORT = process.env.PORT || 3000;
    static readonly LOG_LEVEL = process.env.LOG_LEVEL || "info";
    static readonly CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

    constructor() {
        throw new Error("Cannot instantiate Config class");
    }
}