module SheetOrderOpration {
    export function initSheet(orderOpration: OrderOpration, sheetData: SheetData): void {
        orderOpration.spreadSheet.setSheetData(sheetData);
        orderOpration.spreadSheet.initSheet();
    }
    export function openSheet(orderOpration: OrderOpration, sheetData: SheetData): void {
        orderOpration.spreadSheet.setSheetData(sheetData);
        orderOpration.spreadSheet.openSpreadSheet();
    }
}

module Opration {
    export function getSheetDataOpration(orderOpration: OrderOpration): GoogleAppsScript.Content.TextOutput {
        return returnData({ status: Status.OK, data: { sheetData: orderOpration.spreadSheet.sheetArray } });
    }
    export function getOrderOpration(jsonData: any, orderOpration: OrderOpration): GoogleAppsScript.Content.TextOutput {
        const recordGet: RecordGet = jsonData.data.getData;
        const recordGetData = getOrder(recordGet, orderOpration);
        return returnData({ status: Status.OK, data: { recordData: recordGetData } });
    }

    export function getSheetsNameOpration(orderOpration: OrderOpration, sheetData: any): GoogleAppsScript.Content.TextOutput {
        SheetOrderOpration.openSheet(orderOpration, sheetData);
        const sheetsName = getSheetsName(orderOpration);
        return returnData({ status: Status.OK, data: { sheetsName: sheetsName } });
    }

    //TODO 行がゼロオリジンで大丈夫か
    export function addOrderOpration(orderOpration: OrderOpration, sheetData: SheetData, jsonData: Post, scriptLock: GoogleAppsScript.Lock.Lock): GoogleAppsScript.Content.TextOutput {
        SheetOrderOpration.initSheet(orderOpration, sheetData);
        //@ts-ignore
        const recordData: RecordData = jsonData.data.addData;
        assignAddOrder(recordData, orderOpration);
        scriptLock.releaseLock();
        return returnData({ status: Status.OK });
    }

    export function editOrderOpration(orderOpration: OrderOpration, sheetData: SheetData, jsonData: Post, scriptLock: GoogleAppsScript.Lock.Lock): GoogleAppsScript.Content.TextOutput {
        SheetOrderOpration.initSheet(orderOpration, sheetData);
        //@ts-ignore
        const recordEdit: RecordEdit = jsonData.data.editData;
        recordEdit.forEach(data => {
            orderOpration.spreadSheet.sheet.getRange(data.row + 1, data.col + 1).setValue(data.data);
        });
        scriptLock.releaseLock();
        return returnData({ status: Status.OK });
    }

    export function editOrderByFinderOpration(orderOpration: OrderOpration, sheetData: SheetData, jsonData: Post, scriptLock: GoogleAppsScript.Lock.Lock): GoogleAppsScript.Content.TextOutput {
        SheetOrderOpration.initSheet(orderOpration, sheetData);
        //@ts-ignore
        const recordEdit: RecordEditByFinder = jsonData.data.editDataByFinder;
        const recordGetData = getOrder(recordEdit, orderOpration);
        orderOpration.spreadSheet.sheet.getRange(recordGetData.row + 1, recordEdit.editCol + 1).setValue(recordEdit.value);
        scriptLock.releaseLock();
        return returnData({ status: Status.OK });
    }

    export function addSheetNameOpration(orderOpration: OrderOpration, sheetData: SheetData, jsonData: Post, scriptLock: GoogleAppsScript.Lock.Lock): GoogleAppsScript.Content.TextOutput {
        SheetOrderOpration.openSheet(orderOpration, sheetData);
        orderOpration.spreadSheet.spreadSheet.insertSheet().setName(String(jsonData.data.addSheetName));
        scriptLock.releaseLock();
        return returnData({ status: Status.OK });
    }

    function getOrder(data: RecordGet, orderOpration: OrderOpration): RecordData {
        return orderOpration.getOrder(data);
    }

    function assignAddOrder(recordData: RecordData | RecordDataArray, orderOpration: OrderOpration): void {
        if (typeof recordData.data[0] === "string" || typeof recordData.data[0] === "number") {
            addOrder(recordData, orderOpration);
        } else if (recordData.data.length === 1) {
            if ("row" in recordData) {
                addOrder({ row: recordData.row, data: recordData.data[0] }, orderOpration);
            } else {
                addOrder({ data: recordData.data[0] }, orderOpration);
            }
        } else {
            addOrders(recordData, orderOpration);
        }
    }
    function addOrder(recordData: RecordData, orderOpration: OrderOpration): void {
        orderOpration.addOrder(recordData);
    }
    function addOrders(recordDataArray: RecordDataArray, orderOpration: OrderOpration): void {
        orderOpration.addOrders(recordDataArray);
    }

    function getSheetsName(orderOpration: OrderOpration): string[] {
        return orderOpration.spreadSheet.spreadSheet.getSheets().map(s => s.getSheetName());
    }
}
