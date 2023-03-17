import { DefinedType, GASRequestBodyAddData, SheetData } from "./type";
import { BasePool } from "./type/Pool";

/** Manage used order numbers, create order numbers. */
export class UsedOrderNumberPool extends BasePool<number> {
    private _currentMaxOrderNumber: number = 0;
    get currentMaxOrderNumber(): number { return this._currentMaxOrderNumber; }
    /** Create a used order number log from sheet data. */
    override fromSheet(sheetData: SheetData): void {
        sheetData?.forEach(row => {
            this.oldSet.add(row[0] as number);
        });
        this._currentMaxOrderNumber = [...this.oldSet].sort((a, b) => b - a)[0] ?? 0;
    }
    /** Add used order number to the used order number pool. */
    override add(number: number): void {
        this.currentSet.add(number);
        this._currentMaxOrderNumber = Math.max(this._currentMaxOrderNumber, number);
    }
    /** Creates the order number. */
    override generate(): number {
        const newNumber = this._currentMaxOrderNumber + 1;
        this.add(newNumber);
        return newNumber;
    }
    /** Write the pool to the sheet. */
    override writeLog(sheetName: string): void {
        if (!this.sheetUtils.isExistSheet(sheetName)) this.sheetUtils.createSheet(sheetName);

        const addData = [...this.currentSet].reduce((oldList, current) => oldList.concat([[current]]), [] as number[][]);
        if (addData.length === 0) return;
        const payload: GASRequestBodyAddData = {
            oprationType: DefinedType.oprationConf.ADD_ORDER,
            data: {
                sheetData: {
                    sheetId: this.sheetIdAndSS_API_URL.sheetId,
                    sheetName
                },
                addData: { data: addData }
            }
        };
        this.SS_API_FetchRetry.fetchRetry(undefined, payload);
    }
}
