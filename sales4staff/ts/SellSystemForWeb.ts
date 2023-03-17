import { SellSystem } from "./SellSystem";
import { GASfetchRetry } from "./connect";
import { DefinedType, GASRequestBodyEditByFinderData, GASRequestBodyGetData, GASRequestBodyGetSheetData, GetInitSheetDataSheetNames, ItemData, KeyOfGetInitSheetDataSheetNames, RowData, SheetData } from "./type";

/**
 * An extension of `SellSystem` for the web.
 *
 * @example const sellSystemForWeb = new SellSystemForWeb(scriptUrl);
 */
export class SellSystemForWeb extends SellSystem {
    /**
     * Pick up the sheets needed for initialization. The got data is passed to `getInitData`.
     *
     * @example await sellSystemForWeb.getInitSheetData(sheetNames);
     */
    async getInitSheetData(sheetNames: GetInitSheetDataSheetNames): Promise<void> {
        const oprationType = DefinedType.oprationConf.GET_SHEET_DATA;

        const fetchList: [KeyOfGetInitSheetDataSheetNames, Promise<{ [key: string]: any; }>][] = (Object.keys(sheetNames) as KeyOfGetInitSheetDataSheetNames[]).map(key => {
            const data: GASRequestBodyGetSheetData = {
                oprationType, data: { sheetData: { sheetId: this.sheetId, sheetName: sheetNames[key] } }
            };
            return [key, GASfetchRetry(this.scriptUrl, JSON.stringify(data), this.fetchRetryCount)];
        });
        const sheetDataWithKey = await Promise.all(fetchList.map(async ([key, promise]): Promise<[KeyOfGetInitSheetDataSheetNames, SheetData]> => [key, (await promise).data.sheetData]));
        const initSheetData = sheetDataWithKey.reduce((obj, [key, sheetData]) => { obj[key] = sheetData; return obj; }, {} as { [key in KeyOfGetInitSheetDataSheetNames]: SheetData });
        this.getInitData(initSheetData);
    }

    /** The order data is picked up based on the order number. */
    protected async getOrder(orderNumber: number): Promise<RowData> {
        if (!this._propertyCol) throw Error();
        const option: GASRequestBodyGetData = {
            oprationType: DefinedType.oprationConf.GET_ORDER,
            data: {
                sheetData: {
                    sheetId: this.sheetId,
                    sheetName: this.orderSheetName
                },
                getData: {
                    col: this._propertyCol.orderNumber,
                    finder: orderNumber
                }
            }
        };
        const orderPromise = GASfetchRetry(this.scriptUrl, JSON.stringify(option), this.fetchRetryCount);
        const order: RowData = (await orderPromise).data.recordData.data;
        return order;
    }

    /**
     * Returns the interpreted order data and whether it has been paid or not.
     *
     * @example const { data, alreadyPaid } = await sellSystemForWeb.orderItem(12345);
     */
    async orderItem(orderNumber: number): Promise<{ data: [Map<ItemData, number>, number]; alreadyPaid: boolean; }> {
        const order = await this.getOrder(orderNumber);
        const alreadyPaid = Boolean(order[this._propertyCol.bought]);
        return { data: this.parseOrder(order), alreadyPaid };
    }

    /**
     * Mark as paid.
     *
     * @example sellSystemForWeb.recordBought(12345);
     */
    recordBought(orderNumber: number): Promise<{ [key: string]: any; }> {
        if (!this._propertyCol) throw Error();
        const option: GASRequestBodyEditByFinderData = {
            oprationType: DefinedType.oprationConf.EDIT_ORDER_BY_FINDER,
            data: {
                sheetData: {
                    sheetId: this.sheetId,
                    sheetName: this.orderSheetName
                },
                editDataByFinder: {
                    col: this._propertyCol.orderNumber,
                    finder: orderNumber,
                    editCol: this._propertyCol.bought,
                    value: true
                }
            }
        };
        return GASfetchRetry(this.scriptUrl, JSON.stringify(option), this.fetchRetryCount);
    }
}
