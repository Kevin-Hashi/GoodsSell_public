import { DefinedType, GASRequestBodyAddData, SheetData } from "./type";
import { BasePool } from "./type/Pool";

/** Create and manage mail logs. */
export class MailLogPool extends BasePool<number, [number, string], Date> {
    protected lastSend = 0;
    /** Create a mail log from sheet data. */
    override fromSheet(sheetData: SheetData): void {
        const validDate = sheetData.map(row => row[0]).filter(cell => cell).map(cell => Date.parse(cell as string)).filter(date => !Number.isNaN(date));
        const sortedValidDate = validDate.sort((a, b) => a - b);
        sortedValidDate.forEach(date => this.oldSet.add(date));
        this.lastSend = [...sortedValidDate].reverse()[0] || 0;
    }
    /** Creates the date and time of transmission. */
    override generate(): Date {
        const dateNumber = this.lastSend + 36000;
        const nowNumber = Date.now();
        const sendNumber = Math.max(dateNumber, nowNumber);

        const send = new Date(sendNumber);
        return send;
    }
    /** Add log to the log list. */
    override add(sendDateNumberAndMessageId: [number, string]): void {
        this.currentSet.add(sendDateNumberAndMessageId);
        this.lastSend = sendDateNumberAndMessageId[0];
    }
    /** Write the log list to the sheet. */
    override writeLog(sheetName: string): void {
        if (!this.sheetUtils.isExistSheet(sheetName)) this.sheetUtils.createSheet(sheetName);

        const oprationType = DefinedType.oprationConf.ADD_ORDER;
        const payload: GASRequestBodyAddData = {
            oprationType,
            data: {
                sheetData: { sheetId: this.sheetIdAndSS_API_URL.sheetId, sheetName: sheetName },
                addData: { data: [...this.currentSet].map(([dateNumber, messageId]) => { const date = new Date(dateNumber); return [date.toISOString(), messageId]; }) }
            }
        };
        this.SS_API_FetchRetry.fetchRetry(undefined, payload);
    }
}
