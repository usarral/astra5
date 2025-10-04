export class Config {
    static readonly PORT = process.env.PORT || 3000;
    static readonly LOG_LEVEL = process.env.LOG_LEVEL || "info";
    static readonly CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
    static readonly SUPABASE_URL = process.env.SUPABASE_URL || '';
    static readonly SUPABASE_KEY = process.env.SUPABASE_KEY || '';
    constructor() {
        throw new Error("Cannot instantiate Config class");
    }
}