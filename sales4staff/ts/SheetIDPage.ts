import { Breadcrumb, BreadcrumbList } from "./Breadcrumb";
import { GetElement } from "./ElementGet";
import { FirstPageAndBreadcrumbList } from "./PageAndBreadcrumbList";
import { SellSystem } from "./SellSystem";

/** The first page is for entering the sheet ID.
 *
 * @example const sheetIdPage = new SheetIdPage(pageId, pageBreadCrumb, breadcrumbList, sellSystem, sheetIdInputId);
 */
export class SheetIDPage extends FirstPageAndBreadcrumbList {
    constructor(pageId: string, pageBreadCrumb: Breadcrumb, breadcrumbList: BreadcrumbList, protected readonly sellSystem: SellSystem, protected readonly sheetIdInputId: string) {
        super(pageId, pageBreadCrumb, breadcrumbList);
    }

    /** Once you press the button, you will move to the next page.
     *
     * @example sheetIdPage.action();
     */
    action(): void | never {
        const sheetId = GetElement.getHTMLInputElement(this.sheetIdInputId).value;
        if (!sheetId) throw Error("sheetId is empty");
        this.sellSystem.setSheetId(sheetId);
        this.leaveThisPage();
        if (this.nextPageAndBreadcrumbList === undefined) throw Error("this.nextPageAndBreadcrumbList is undefined");
        if (this.breadcrumbList.last !== this.pageBreadCrumb) throw Error("breadcrumbList may be changed");
        this.nextPageAndBreadcrumbList.comeToThisPage();
    }
}
