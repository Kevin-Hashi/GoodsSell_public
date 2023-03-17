const oprationConf = {
    GET_ORDER: "GET_ORDER",
    ADD_ORDER: "ADD_ORDER",
    EDIT_ORDER: "EDIT_ORDER",
    EDIT_ORDER_BY_FINDER: "EDIT_ORDER_BY_FINDER",
    ADD_SHEET_NAME: "ADD_SHEET_NAME",
    GET_SHEETS_NAME: "GET_SHEETS_NAME",
    GET_SHEET_DATA: "GET_SHEET_DATA",
} as const;
const oprationConfSet = new Set(Object.values(oprationConf));
const getOprationSet = new Set([oprationConf.GET_ORDER, oprationConf.GET_SHEETS_NAME, oprationConf.GET_SHEET_DATA]);

const parameterConf = { OPARATION: "oprationType" };

const lockWaitTime = 5000;//ms

function doPost(e: GoogleAppsScript.Events.DoPost): GoogleAppsScript.Content.TextOutput {
    const scriptLock = LockService.getScriptLock();
    try {
        //@ts-ignore
        const jsonData = JSON.parse(e.postData.getDataAsString());
        const orderOpration = new OrderOpration();
        if (!("oprationType" in jsonData)) return returnData({ status: Status.MISSED, errorcode: ErrorCode.NotExistKey });
        const oprationType: string = jsonData.oprationType;
        //@ts-ignore
        if (!(oprationConfSet.has(oprationType))) return returnData({ status: Status.MISSED, errorcode: ErrorCode.ImplementError });

        const sheetData: SheetData = jsonData.data.sheetData;
        if (oprationType === oprationConf.ADD_ORDER) {
            if (scriptLock.tryLock(lockWaitTime)) return Opration.addOrderOpration(orderOpration, sheetData, jsonData, scriptLock);
            else return returnLockTimeError();
        } else if (oprationType === oprationConf.EDIT_ORDER) {
            if (scriptLock.tryLock(lockWaitTime)) return Opration.editOrderOpration(orderOpration, sheetData, jsonData, scriptLock);
            else return returnLockTimeError();
        } else if (oprationType === oprationConf.EDIT_ORDER_BY_FINDER) {
            if (scriptLock.tryLock(lockWaitTime)) return Opration.editOrderByFinderOpration(orderOpration, sheetData, jsonData, scriptLock);
            else return returnLockTimeError();
        } else if (oprationType === oprationConf.ADD_SHEET_NAME) {
            if (scriptLock.tryLock(lockWaitTime)) return Opration.addSheetNameOpration(orderOpration, sheetData, jsonData, scriptLock);
            else return returnLockTimeError();
        }
        //@ts-ignore
        else if (getOprationSet.has(oprationType)) {
            if (scriptLock.tryLock(lockWaitTime)) {
                scriptLock.releaseLock();
                if (oprationType === oprationConf.GET_SHEETS_NAME) return Opration.getSheetsNameOpration(orderOpration, sheetData);
                else {
                    SheetOrderOpration.initSheet(orderOpration, sheetData);
                    if (oprationType === oprationConf.GET_ORDER) return Opration.getOrderOpration(jsonData, orderOpration);
                    if (oprationType === oprationConf.GET_SHEET_DATA) return Opration.getSheetDataOpration(orderOpration);
                    return returnData({ status: Status.MISSED, errorcode: ErrorCode.TypeError });
                }
            } else return returnLockTimeError();
        } else return returnData({ status: Status.MISSED, errorcode: ErrorCode.TypeError });
    } catch (e) {
        scriptLock.releaseLock();
        return returnData({ status: Status.MISSED, data: { errorName: e.name, errorMessage: e.message, fileName: e.fileName ? e.fileName : -1, line: e.lineNumber ? e.lineNumber : -1 } });
    }
}

function returnLockTimeError(): GoogleAppsScript.Content.TextOutput {
    return returnData({ status: Status.MISSED, errorcode: ErrorCode.LockTimeOut });
}
