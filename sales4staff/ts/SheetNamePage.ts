import { Breadcrumb, BreadcrumbList } from "./Breadcrumb";
import { GetElement } from "./ElementGet";
import { GASfetchError } from "./Errors";
import { ErrorModal } from "./Modal";
import { PageAndBreadcrumbList } from "./PageAndBreadcrumbList";
import { SellSystemForWeb } from "./SellSystemForWeb";
import { Visibility } from "./Visibility";

/**
 * It stores the sheet names that are needed now.
 * I think I found a similar type... Forget!
 */
export interface SheetNameID {
    sheetNameItemList: string;
    sheetNameItemGroup: string;
    sheetNameProperty: string;
}

/**
 * Page 2.
 * Let's fill in the name of the sheet needed for initialization.
 */
export class SheetNamePage extends PageAndBreadcrumbList {
    errorModal: ErrorModal | undefined;
    constructor(pageId: string, pageBreadCrumb: Breadcrumb, breadcrumbList: BreadcrumbList, protected readonly loaderPageId: string, protected readonly sellSystem: SellSystemForWeb, protected readonly sheetNameID: SheetNameID) {
        super(pageId, pageBreadCrumb, breadcrumbList);
    }

    /**
     * When the button is pressed, the loader is displayed while the sheet is being retrieved.
     * After the sheet is fetched, it will move to the next page.
     */
    async action(): Promise<void> | never {
        const sheetNameItemList = GetElement.getHTMLInputElement(this.sheetNameID.sheetNameItemList).value;
        const sheetNameItemGroup = GetElement.getHTMLInputElement(this.sheetNameID.sheetNameItemGroup).value;
        const sheetNameProperty = GetElement.getHTMLInputElement(this.sheetNameID.sheetNameProperty).value;
        this.invisibleThisPage();
        this.visibleLoader();
        try { await this.sellSystem.getInitSheetData({ itemList: sheetNameItemList, itemGroup: sheetNameItemGroup, property: sheetNameProperty }); }
        catch (e) {
            if (this.errorModal) {
                if (e instanceof GASfetchError) {
                    this.errorModal.open("Sheet not found!" + e.message);
                }
            }
            throw e;
        }
        this.invisibleLoader();
        this.leaveThisPage();
        if (this.nextPageAndBreadcrumbList === undefined) throw TypeError("this.nextPageAndBreadcrumbList is undefined");
        if (this.breadcrumbList.last !== this.pageBreadCrumb) throw Error("breadcrumbList may be changed");
        this.nextPageAndBreadcrumbList.comeToThisPage();
    }

    /** Leave this page to view the loader. */
    override leaveThisPage(): void {
        super.leaveThisPage();
        this.invisibleLoader();
    }

    /** Loaders are displayed. */
    private visibleLoader(): void {
        Visibility.visible(this.loaderPageId);
    }

    /** Hide the loader. */
    private invisibleLoader(): void {
        Visibility.invisible(this.loaderPageId);
    }
}
