//@ts-check
///<reference path="connect.js" />
/**
 * @param {string} sheetId
 * @param {RequestInfo | URL} apiUrl
 */
async function getAllSheetNames(sheetId, apiUrl) {
    const sheetData = { sheetId: sheetId };
    const data = {
        sheetData: sheetData,
        oprationType: "GET_SHEETS_NAME",
    };
    return getJSONfromfetch(fetchCreater(apiUrl, data));
}
