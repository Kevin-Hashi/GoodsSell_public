import { CallOptions, SheetNamesForCallOptions } from "./CallOptions";
import { MailCreator } from "./MailCreator";
import { MailLimitChecker } from "./MailLimitChecker";
import { OrderNumberCreator } from "./OrderNumberCreator";
import { SellSystemForGAS } from "./SellSystemForGAS";
import { SheetUtils } from "./SheetUtils";
import { UsedOrderNumberPool } from "./UsedOrderNumberPool";
import { SS_API_FetchUtils } from "./connect";
import { CreateQR } from "./createQR";
import { DefinedType, EditRecordData, GASRequestBodyEditData } from "./type";
import { SheetIdAndSS_API_URL } from "./type/SheetIdAndSS_API_URL";

console.table = (tabularData?: any, properties?: string[]) => { };

/** Class for batch processing. */
export class Batch {
    private readonly sheetUtils: SheetUtils;
    private readonly sheetNames: SheetNamesForCallOptions;
    private readonly mailCreator: MailCreator;
    private readonly usedOrderNumberPool: UsedOrderNumberPool;
    private readonly mailLimitChecker: MailLimitChecker;
    private readonly orderNumberCreator: OrderNumberCreator;
    private readonly sellSystem: SellSystemForGAS;
    private readonly SS_API_FetchUtils: SS_API_FetchUtils;
    constructor(private readonly callOptions: CallOptions) {
        const { SS_API_URL, sheetId, sheetNames, sendinblueApiKey } = this.callOptions;

        const sheetIdAndSS_API_URL: SheetIdAndSS_API_URL = { sheetId, SS_API_URL };

        this.sheetUtils = new SheetUtils(sheetIdAndSS_API_URL);
        this.sheetNames = sheetNames;

        this.mailCreator = new MailCreator(sendinblueApiKey, sheetIdAndSS_API_URL);
        this.usedOrderNumberPool = new UsedOrderNumberPool(sheetIdAndSS_API_URL);
        this.mailLimitChecker = new MailLimitChecker(sendinblueApiKey);
        this.orderNumberCreator = new OrderNumberCreator(this.usedOrderNumberPool);

        this.sellSystem = new SellSystemForGAS(SS_API_URL);
        this.SS_API_FetchUtils = new SS_API_FetchUtils({ SS_API_URL, sheetId });
    }
    /** Fill in the order number and send an email. */
    sendMailBatch(): void {
        const { sheetId, contact } = this.callOptions;
        const { orderSheetName, usedOrderNumberSheetName, mailLogSheetName, itemListSheetName, itemGroupSheetName, propertySheetName } = this.sheetNames;

        const editList: EditRecordData = [];

        const orderSheetData = this.sheetUtils.getSheetData(orderSheetName);
        const usedOrderNumberSheet = this.sheetUtils.getSheetData(usedOrderNumberSheetName).filter(row => typeof row[0] === 'number');

        const mailLogSheetData = this.sheetUtils.getSheetData(mailLogSheetName);
        this.mailCreator.mailLogPool.fromSheet(mailLogSheetData);

        this.mailLimitChecker.getFreeMailLimit();
        console.log(this.mailLimitChecker.remaining);
        if (this.mailLimitChecker.remaining === 0) { console.log("Limit!"); return; }

        this.usedOrderNumberPool.fromSheet(usedOrderNumberSheet);

        this.sellSystem.setSheetId(sheetId);
        this.sellSystem.getInitSheetData({ itemList: itemListSheetName, itemGroup: itemGroupSheetName, property: propertySheetName });

        console.log("Get all sheet");

        const orderOfNullOrderNumber = orderSheetData.map(<T>(order: T, index: number): [number, T] => [index, order]).filter(order => !order[1][this.sellSystem.propertyCol.orderNumber]);

        console.log("separate order");

        if (orderOfNullOrderNumber.length === 0) return;

        for (const [index, order] of orderOfNullOrderNumber) {
            // console.log("----------------------------");
            // console.log(index);
            if (order.every(value => value === "")) continue;
            // console.log(order.join(" "));
            // console.log(hex(order.join(" ")));
            const orderItem = this.sellSystem.parseOrder(order);
            const orderNumber = this.orderNumberCreator.create();
            const name = this.sellSystem.getName(order);
            const mailAddress = this.sellSystem.getMailAddress(order);
            const mailSubject = MailCreator.createMailSubject();
            const studentNumber = this.sellSystem.getStudentNumber(order);
            const mailTextBody = MailCreator.createTextMailBody(name, studentNumber, orderNumber, orderItem, contact);
            const mailHtmlBody = MailCreator.createHtmlMailBody(name, studentNumber, orderNumber, orderItem, contact, mailSubject);
            const orderNumberQRCode = CreateQR.createQR(String(orderNumber));

            const schedule = this.mailCreator.mailLogPool.generate();
            schedule.setSeconds(schedule.getSeconds() + 20);
            console.log("mail scheduling...");
            // console.log(mailAddress, name, studentNumber, orderNumberQRCode, mailTextBody, mailSubject);
            // mailHtmlBody.split("\n").forEach(line => console.log(line));
            try {
                const response = this.mailCreator.sendMail(mailAddress, mailTextBody, mailHtmlBody, mailSubject, [{ content: orderNumberQRCode, name: "QRCode.png" }], schedule);
                this.mailCreator.mailLogPool.add([schedule.getTime(), JSON.parse(response.getContentText()).messageId]);
                this.mailLimitChecker.send();
                console.log("mail scheduled");
                editList.push({ data: orderNumber, row: index, col: this.sellSystem.propertyCol.orderNumber });
            }
            catch (e) {
            }
            if (this.mailLimitChecker.remaining === 0) {
                this.end(editList);
                console.log("Reached limit!");
                return;
            }
        };
        this.end(editList);
    }
    /** Called when `sendMailBatch` is ended. */
    private end(editList: EditRecordData): void {
        const { sheetId } = this.callOptions;
        const { orderSheetName, mailLogSheetName, usedOrderNumberSheetName } = this.sheetNames;

        const addOrderNumberFetchOption: GASRequestBodyEditData = {
            oprationType: DefinedType.oprationConf.EDIT_ORDER,
            data: {
                sheetData: { sheetId, sheetName: orderSheetName },
                editData: editList
            }
        };
        this.SS_API_FetchUtils.fetchRetry(undefined, addOrderNumberFetchOption);

        console.log("order number added");

        this.mailCreator.mailLogPool.writeLog(mailLogSheetName);

        console.log("mailLog written");

        this.usedOrderNumberPool.writeLog(usedOrderNumberSheetName);

        console.log("used order number written");
        console.log("finish");
    }
}
