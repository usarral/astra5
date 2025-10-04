export class AstraError extends Error {
	constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, AstraError.prototype);
        this.name = "AstraError";
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}