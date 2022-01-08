export class InvalidDataError extends Error
{
    constructor(msg?: string) {
        super(msg);
    }
}
