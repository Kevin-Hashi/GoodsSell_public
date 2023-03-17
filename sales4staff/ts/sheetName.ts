import { GASfetchRetry } from "./connect";
import { DefinedType, GASRequestBodyGetSheetsName } from "./type";

/**
 * Get all sheet names in the spreadsheet.
 * This is not used anywhere in this project.
 *
 * @example const sheetNames = await getAllSheetNames(spreadsheetId, SS_API_URL);
 * console.table(sheetNames.data.sheetName);
 */
export async function getAllSheetNames(sheetId: string, apiUrl: RequestInfo | URL): Promise<{ [key: string]: any; }> {
    const sheetData = { sheetId };
    const data: GASRequestBodyGetSheetsName = {
        oprationType: DefinedType.oprationConf.GET_SHEETS_NAME,
        data: { sheetData }
    };
    return await GASfetchRetry(apiUrl, JSON.stringify(data), 10);
};
