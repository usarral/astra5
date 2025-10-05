import { Config } from "../utils/config";
import type { InformationService, Item } from "../types/types";

export class BackendService {
    private readonly baseUrl: string = Config.BACKEND_URL || "http://localhost:3000";

    constructor() {
        this.baseUrl = Config.BACKEND_URL;
    }

    // Call to /information to get InformationService type data
    public async getInformation(): Promise<InformationService> {
        const response = await fetch(`${this.baseUrl}/information`);
        if (!response.ok) {
            throw new Error(`Error fetching information: ${response.statusText}`);
        }
        const json = await response.json();
        return json as InformationService;
    }

    // Call to /information/:id to get Item type data
    public async getItemById(id: string): Promise<Item> {
        const response = await fetch(`${this.baseUrl}/information/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching information: ${response.statusText}`);
        }
        const json = await response.json();
        return json as Item;
    }
}