import { CheckDigit } from "./CheckDigit";
import { UsedOrderNumberPool } from "./UsedOrderNumberPool";

/** Generates an order number. */
export class OrderNumberCreator {
    private readonly checkDigit = new CheckDigit.Damm();
    constructor(protected readonly usedOrderNumberPool: UsedOrderNumberPool) { }
    /** `${number}${checkDigit}` format. */
    create(): number {
        const number = this.usedOrderNumberPool.generate();
        const fullNumber = Number(this.checkDigit.generate(String(number)));
        return fullNumber;
    }
}
