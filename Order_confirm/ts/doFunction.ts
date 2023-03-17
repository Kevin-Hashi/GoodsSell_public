import { Batch } from "./Batch";
import { CallOptions } from "./CallOptions";

/** 
 * Operates when POST is received.
 * Execute `Batch.sendMailBatch`
 * @see {@link Batch.Batch.sendMailBatch}
 */
export function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
    //@ts-ignore
    const params = JSON.parse(e.postData.getDataAsString());
    if (isCallOptions(params)) {
        try {
            const batch = new Batch(params);
            batch.sendMailBatch();
            return returnData(0, { success: true });
        } catch (e) {
            if (e instanceof Error) {
                return returnData(1, { errorMessage: e.name + "\n" + e.message });
            } else {
                return returnData(1, { errorMessage: "Unexpected throw" });
            }
        }
    } else {
        return returnData(1, { errorMessage: "Invalid call options" });
    }
}
/** Returns status number and data as a `TextOutput`. */
function returnData(status: number, data: { [x: string]: string | number | boolean | null; }): GoogleAppsScript.Content.TextOutput {
    return ContentService.createTextOutput().setContent(JSON.stringify({ status, data }));
}
/** Judges whether the entered value satisfies `CallOptions`. */
function isCallOptions(value: unknown): value is CallOptions {
    if (typeof value !== "object" || value === null) return false;

    const { sheetId, sheetNames, SS_API_URL, contact, sendinblueApiKey } = value as Record<keyof CallOptions, unknown>;
    if (typeof sheetId !== 'string') return false;

    if (typeof sheetNames !== 'object' || sheetNames === null) return false;
    const { orderSheetName, mailLogSheetName, itemListSheetName, itemGroupSheetName, usedOrderNumberSheetName, propertySheetName } = sheetNames as Record<keyof CallOptions["sheetNames"], unknown>;
    if (typeof orderSheetName !== 'string') return false;
    if (typeof mailLogSheetName !== 'string') return false;
    if (typeof itemListSheetName !== 'string') return false;
    if (typeof itemGroupSheetName !== 'string') return false;
    if (typeof usedOrderNumberSheetName !== 'string') return false;
    if (typeof propertySheetName !== 'string') return false;

    if (typeof SS_API_URL !== 'string') return false;

    if (typeof contact !== 'string') return false;

    if (typeof sendinblueApiKey !== 'string') return false;

    return true;
}
