import { MailLogPool } from "./MailLogPool";
import { FetchUtils } from "./connect";
import { TextContent } from "./htmlTemplate/TextContent";
import { Td } from "./htmlTemplate/td";
import { Th } from "./htmlTemplate/th";
import { Tr } from "./htmlTemplate/tr";
import { ItemData } from "./type";
import { SheetIdAndSS_API_URL } from "./type/SheetIdAndSS_API_URL";

interface Attachment {
    content: string;
    name: string;
};
/** The body is made from a mail template. */
export class MailCreator {
    readonly mailLogPool: MailLogPool;
    constructor(protected readonly apiKey: string, sheetIdAndSS_API_URL:SheetIdAndSS_API_URL) {
        this.mailLogPool = new MailLogPool(sheetIdAndSS_API_URL);
    }
    /** Create a title for the email. */
    static createMailSubject(): string {
        return "ご注文受付のお知らせ";
    }
    /** Creates the plain text body of the email. */
    static createTextMailBody(name: string, studentNumber: string, orderNumber: number, orderItemWithPrice: [Map<ItemData, number>, number], contact: string): string {
        const orderItem = orderItemWithPrice[0];
        const orderItemText = [...orderItem.entries()].reduce((txt, [itemData, num]) => txt + `${itemData.itemGroupName} ${itemData.name} ${itemData.size ?? ''} ${itemData.price.toLocaleString()} ${num} ${(itemData.price * num).toLocaleString()}` + '\n', '');
        return `${studentNumber} ${name} 様\nこの度はご注文ありがとうございました。\nご注文番号:${orderNumber}\n\n----------\n` +
            `ご注文内容\n\n商品種別  商品名  商品仕様  金額  数量  小計` + orderItemText + `\n\n合計金額: ${orderItemWithPrice[1].toLocaleString()}円\n\nなお、注文締め切りまでは注文内容の変更を承ることができる場合がございます。担当の者、または${contact}までご連絡ください。`;
    }
    /** Create the HTML body of the email. */
    static createHtmlMailBody(name: string, studentNumber: string, orderNumber: number, orderItemWithPrice: [Map<ItemData, number>, number], contact: string, subject: string): string {
        let baseHTML = HtmlService.createTemplateFromFile('html/mail').evaluate().getContent();
        baseHTML = baseHTML.replace(/%SUBJECT%/g, subject);
        baseHTML = baseHTML.replace(/%NAME%/g, name);
        baseHTML = baseHTML.replace(/%STUDENT_NUMBER%/g, studentNumber);
        baseHTML = baseHTML.replace(/%ORDER_NUMBER%/g, orderNumber.toString());
        const thead: string = (() => {
            const tr = new Tr();
            ["商品種別", "商品名", "商品仕様", "単価", "数量", "小計"].forEach(content => {
                const th = new Th();
                th.appendChild(new TextContent(content));
                tr.appendChild(th);
            });
            return tr.toHtml();
        })();
        baseHTML = baseHTML.replace(/%ORDER_THEAD%/g, thead);
        const tbody: string = (() => {
            const trList: Tr[] = [...orderItemWithPrice[0].entries()].map(([itemData, value]) => {
                const tr = new Tr();
                tr.appendChild(new Td().appendChild(new TextContent(itemData.itemGroupName)));
                tr.appendChild(new Td().appendChild(new TextContent(itemData.name)));
                tr.appendChild(new Td().appendChild(new TextContent(itemData.size || '')));
                tr.appendChild(new Td().appendChild(new TextContent(itemData.price.toLocaleString())));
                tr.appendChild(new Td().appendChild(new TextContent(value.toLocaleString())));
                tr.appendChild(new Td().appendChild(new TextContent((itemData.price * value).toLocaleString())));
                // console.log("tr:", tr.toHtml());
                return tr;
            });
            return trList.reduce((html, tr) => html + tr.toHtml(), "");
        })();
        baseHTML = baseHTML.replace(/%ORDER_TBODY%/g, tbody);
        baseHTML = baseHTML.replace(/%TOTAL_AMOUNT%/g, orderItemWithPrice[1].toLocaleString());
        baseHTML = baseHTML.replace(/%CONTACT%/g, contact);
        return baseHTML;
    }
    /** Send an email. */
    sendMail(to: string, textContent: string, htmlContent: string | null, subject: string, attachment: Attachment[], schedule: Date, retry: number = 10): GoogleAppsScript.URL_Fetch.HTTPResponse {
        const header = {
            accept: "application/json",
            "api-key": this.apiKey,
            "content-type": "application/json"
        };
        throw Error('Fill name and mail address');
        const mail = {
            sender: { name: "", email: "" },
            to: [{ email: to }],
            attachment,
            textContent,
            htmlContent,
            subject,
            scheduledAt: schedule.toISOString()
        };
        const response = FetchUtils.fetchRetry("https://api.sendinblue.com/v3/smtp/email", header, mail, (response) => [201, 202].includes(response.getResponseCode()), retry);
        return response;
    }
}
