import { FetchUtils } from "./connect";
import { SellSystem } from "./SellSystem";
import { DefinedType, GASRequestBodyGetSheetData, GetInitSheetDataSheetNames, ItemData, KeyOfGetInitSheetDataSheetNames, RowData, SheetData, cell } from "./type";

/** An extension of `SellSystem` for GAS. */
export class SellSystemForGAS extends SellSystem {
    constructor(protected override readonly scriptUrl: string, fetchRetryCount: number = 10) {
        super(scriptUrl, fetchRetryCount);
    }
    get propertyCol() { return this._propertyCol; }
    /** Pick up the sheets needed for initialization. The got data is passed to `getInitData`. */
    getInitSheetData(sheetNames: GetInitSheetDataSheetNames): void {
        const oprationType = DefinedType.oprationConf.GET_SHEET_DATA;

        const fetchList: [KeyOfGetInitSheetDataSheetNames, string, GASRequestBodyGetSheetData, number][] = (Object.keys(sheetNames) as KeyOfGetInitSheetDataSheetNames[]).map(key => {
            const data: GASRequestBodyGetSheetData = {
                oprationType, data: { sheetData: { sheetId: this.sheetId, sheetName: sheetNames[key] } }
            };
            return [key, this.scriptUrl, data, this.fetchRetryCount];
        });
        const sheetDataWithKey = fetchList.map(([key, url, data, retry]): [KeyOfGetInitSheetDataSheetNames, SheetData] => {
            const response = FetchUtils.fetchRetry(url, undefined, data, (response) => JSON.parse(response.getContentText()).status === 0, retry);
            return [key, JSON.parse(response.getContentText()).data.sheetData];
        });
        const initSheetData = sheetDataWithKey.reduce((obj, [key, sheetData]) => { obj[key] = sheetData; return obj; }, {} as { [key in KeyOfGetInitSheetDataSheetNames]: SheetData });
        this.getInitData(initSheetData);
    }

    /** In the parent, it is protected, but this function needs to be called from the outside, so it is made public. */
    public override parseOrder(order: RowData): [Map<ItemData, number>, number] {
        return super.parseOrder(order);
    }

    /** 
     * Get data from `RowData`.
     * If empty, it will be an empty string instead of undefined.
     */
    private getProperty(data: RowData, key: number): cell {
        return data[key] ?? '';
    }

    /** 
     * Get the name of the order from the `RowData`.
     * If it does not exist, it will be an empty string.
     */
    getName(order: RowData): string {
        return String(this.getProperty(order, this._propertyCol.name)) || '';
    }

    /** 
     * Get the email address from `RowData`.
     * If it does not exist, it will be an empty string.
     */
    getMailAddress(order: RowData): string {
        return String(this.getProperty(order, this._propertyCol.mailAddress)) || '';
    }

    /** 
     * Get the student number from `RowData`.
     * If it does not exist, it will be an empty string.
     */
    getStudentNumber(order: RowData): string {
        return String(this.getProperty(order, this._propertyCol.studentNumber)) || '';
    }
}
