class SpreadSheet {
    sheetData: SheetData;
    #spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
    #sheet: GoogleAppsScript.Spreadsheet.Sheet;
    #sheetArray: any[][];
    get spreadSheet() { return this.#spreadSheet; }
    get sheet() { return this.#sheet; }
    get sheetArray() { return this.#sheetArray; }
    constructor(sheetData: SheetData | undefined) {
        if (sheetData) {
            this.sheetData = sheetData;
        }
    }
    setSheetData(sheetData: SheetData): void {
        this.sheetData = sheetData;
    }
    openSpreadSheet(): void {
        this.#spreadSheet = SpreadsheetApp.openById(this.sheetData.sheetId);
    }
    openSheet(): void {
        const sheet = this.spreadSheet.getSheetByName(this.sheetData.sheetName);
        if (sheet) this.#sheet = sheet;
    }
    readSheet(): void {
        this.#sheetArray = this.sheet.getDataRange().getValues();
    }
    initSheet(): void {
        this.openSpreadSheet();
        this.openSheet();
        this.readSheet();
    }
}

class OrderOpration {
    spreadSheet: SpreadSheet;
    withoutRow: number = 1;
    constructor() {
        this.spreadSheet = new SpreadSheet(undefined);
    }
    getOrder(recordGet: RecordGet): RecordData {
        const targetColArray = this.spreadSheet.sheetArray.map(v => v[recordGet.col]);
        const index = targetColArray.indexOf(recordGet.finder, this.withoutRow);
        const data = this.spreadSheet.sheetArray[index];
        return { row: index, data: data };
    }
    addOrder(recordData: RecordData): void {
        if (recordData.row) {
            this.spreadSheet.sheet.insertRowAfter(recordData.row);
            this.spreadSheet.sheet.getRange(recordData.row + 1 + this.withoutRow, 1, 1).setValues([recordData.data]);
        }
        else {
            this.spreadSheet.sheet.appendRow(recordData.data);
        }
        this.spreadSheet.readSheet();
    }
    addOrders(recordDataArray: RecordDataArray): void {
        if (recordDataArray.row) {
            this.spreadSheet.sheet.insertRowsAfter(recordDataArray.row, recordDataArray.data.length);
            this.spreadSheet.sheet.getRange(recordDataArray.row + 1 + this.withoutRow, 1, recordDataArray.data.length).setValues(recordDataArray.data);
        }
        else {
            const row = this.spreadSheet.sheetArray.length;
            const col = this.spreadSheet.sheetArray[0].length || recordDataArray.data[0].length;
            this.spreadSheet.sheet.getRange(row + this.withoutRow, 1, recordDataArray.data.length, col).setValues(recordDataArray.data);
        }
        this.spreadSheet.readSheet();
    }
}
