import { Config } from "../utils/config";

export class BackendService {
    private readonly baseUrl: string = Config.BACKEND_URL || 'http://localhost:3000';

    constructor() {
        this.baseUrl = Config.BACKEND_URL;
    }

    // Call to /information to get InformationService type data
    public async getInformation(): Promise<any> {
        const response = await fetch(`${this.baseUrl}/information`);
        if (!response.ok) {
            throw new Error(`Error fetching information: ${response.statusText}`);
        }
        return response.json();
    }

    // Call to /information/:id to get Item type data
    public async getItemById(id: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/information/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching information: ${response.statusText}`);
        }
        return response.json();
    }


}