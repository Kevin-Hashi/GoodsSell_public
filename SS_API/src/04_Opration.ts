module SheetOrderOpration {
    export function initSheet(orderOpration: OrderOpration, sheetData: SheetData) {
        orderOpration.spreadSheet.setSheetData(sheetData);
        orderOpration.spreadSheet.initSheet();
    }
    export function openSheet(orderOpration: OrderOpration, sheetData: SheetData) {
        orderOpration.spreadSheet.setSheetData(sheetData);
        orderOpration.spreadSheet.openSpreadSheet();
    }
}

module Opration {
    export function getSheetDataOpration(orderOpration: OrderOpration) {
        return returnData({ status: Status.OK, data: { sheetData: orderOpration.spreadSheet.sheetArray } });
    }
    export function getOrderOpration(jsonData: any, orderOpration: OrderOpration) {
        const recordGet: RecordGet = jsonData.getData;
        const recordGetData = getOrder(recordGet, orderOpration);
        return returnData({ status: Status.OK, data: { recordData: recordGetData } });
    }

    export function getSheetsNameOpration(orderOpration: OrderOpration, sheetData: any) {
        SheetOrderOpration.openSheet(orderOpration, sheetData);
        const sheetsName = getSheetsName(orderOpration);
        return returnData({ status: Status.OK, data: { sheetsName: sheetsName } });
    }

    //TODO 行がゼロオリジンで大丈夫か
    export function addOrderOpration(orderOpration: OrderOpration, sheetData: SheetData, jsonData: any, scriptLock: GoogleAppsScript.Lock.Lock) {
        SheetOrderOpration.initSheet(orderOpration, sheetData);
        const recordData: RecordData = jsonData.addData;
        assignAddOrder(recordData, orderOpration);
        scriptLock.releaseLock();
        return returnData({ status: Status.OK });
    }

    export function editOrderOpration(orderOpration: OrderOpration, sheetData: SheetData, jsonData: any, scriptLock: GoogleAppsScript.Lock.Lock) {
        SheetOrderOpration.initSheet(orderOpration, sheetData);
        const recordEdit: RecordEdit = jsonData.editData;
        const recordGetData = getOrder(recordEdit, orderOpration);
        orderOpration.spreadSheet.sheet.getRange(recordGetData.row + 1, recordEdit.editCol + 1).setValue(recordEdit.value);
        scriptLock.releaseLock();
        return returnData({ status: Status.OK });
    }

    function getOrder(data: RecordGet, orderOpration: OrderOpration): RecordData {
        return orderOpration.getOrder(data);
    }

    function assignAddOrder(recordData: RecordData | RecordDataArray, orderOpration: OrderOpration) {
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
    function addOrder(recordData: RecordData, orderOpration: OrderOpration) {
        orderOpration.addOrder(recordData);
    }
    function addOrders(recordDataArray: RecordDataArray, orderOpration: OrderOpration) {
        orderOpration.addOrders(recordDataArray);
    }

    function getSheetsName(orderOpration: OrderOpration): string[] {
        return orderOpration.spreadSheet.spreadSheet.getSheets().map(s => s.getSheetName());
    }
}
