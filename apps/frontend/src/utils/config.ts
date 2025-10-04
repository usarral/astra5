export class Config {
    // Vite exposes env variables under import.meta.env and user-defined vars must be prefixed with VITE_
    // Use VITE_BACKEND_URL in .env files or the dev server. Fallback to localhost:3000 for local dev.
    static readonly BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:3000';
}