/** Define custom errors. */
export abstract class ExtendBaseError extends Error {
    constructor(e?: string) {
        super(e);
        this.name = new.target.name;

        Error.captureStackTrace(this, this.constructor);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class GASfetchError extends ExtendBaseError { };
export class EmptyOrderError extends ExtendBaseError { };
export class InvalidOrderNumberError extends ExtendBaseError { };
