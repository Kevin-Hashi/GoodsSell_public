import { FetchUtils } from "./connect";
import { DefinedType, GASRequestBodyAddSheetName, GASRequestBodyGetSheetsName, SheetData } from "./type";
import { SheetIdAndSS_API_URL } from "./type/SheetIdAndSS_API_URL";

/** Spreadsheet tool. */
export class SheetUtils {
    constructor(private readonly sheetIdAndSS_API_URL: SheetIdAndSS_API_URL) { }
    /** Check if the sheet exists. */
    isExistSheet(sheetName: string): boolean {
        const response = FetchUtils.fetchRetry(this.sheetIdAndSS_API_URL.SS_API_URL, undefined, { oprationType: DefinedType.oprationConf.GET_SHEETS_NAME, data: { sheetData: { sheetId: this.sheetIdAndSS_API_URL.sheetId, sheetName } } } as GASRequestBodyGetSheetsName, (response) => JSON.parse(response.getContentText()).status === 0);
        return (JSON.parse(response.getContentText()).data.sheetsName as string[]).includes(sheetName);
    }
    /** Get sheet data. */
    getSheetData(sheetName: string): SheetData {
        if (!this.isExistSheet(sheetName)) {
            const operationType = DefinedType.oprationConf.ADD_SHEET_NAME;
            FetchUtils.fetchRetry(this.sheetIdAndSS_API_URL.SS_API_URL, undefined, { oprationType: operationType, data: { sheetData: { sheetId: this.sheetIdAndSS_API_URL.sheetId }, addSheetName: sheetName } } as GASRequestBodyAddSheetName, (response) => JSON.parse(response.getContentText()).status === 0);
        }
        const data = {
            oprationType: DefinedType.oprationConf.GET_SHEET_DATA,
            data: {
                sheetData: {
                    sheetId: this.sheetIdAndSS_API_URL.sheetId,
                    sheetName: sheetName
                }
            }
        };
        const response = FetchUtils.fetchRetry(this.sheetIdAndSS_API_URL.SS_API_URL, undefined, data, (response) => JSON.parse(response.getContentText()).status === 0);
        const json = JSON.parse(response.getContentText());
        return json.data.sheetData;
    }
    /** Create a sheet. */
    createSheet(sheetName: string): void {
        FetchUtils.fetchRetry(this.sheetIdAndSS_API_URL.SS_API_URL, undefined, { oprationType: DefinedType.oprationConf.ADD_SHEET_NAME, data: { sheetData: { sheetId: this.sheetIdAndSS_API_URL.sheetId }, addSheetName: sheetName } } as GASRequestBodyAddSheetName, (response) => JSON.parse(response.getContentText()).status === 0);
    }
}
