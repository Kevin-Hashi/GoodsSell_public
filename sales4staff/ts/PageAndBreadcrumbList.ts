import { Breadcrumb, BreadcrumbList } from "./Breadcrumb";
import { Visibility } from "./Visibility";

/**
 * Manage pages and breadcrumb lists.
 * Here is a summary of what is needed for this project as an SPA.
 */
export abstract class PageAndBreadcrumbListBase {
    constructor(protected readonly pageId: string, protected readonly pageBreadCrumb: Breadcrumb, protected readonly breadcrumbList: BreadcrumbList) { }

    /** ボタンを押したときの動作など */
    abstract action(): void;
    abstract leaveAfterThisPage(): void;

    protected visibleThisPage(): void {
        Visibility.visible(this.pageId);
    }

    protected invisibleThisPage(): void {
        Visibility.invisible(this.pageId);
    }

    leaveThisPage(): void {
        this.invisibleThisPage();
    }
}
/** This is required for the first page of the SPA. */
export abstract class FirstPageAndBreadcrumbList extends PageAndBreadcrumbListBase {
    nextPageAndBreadcrumbList?: LastPageAndBreadcrumbList;

    backToThisPage(): void {
        this.breadcrumbList.removeUntil(this.pageBreadCrumb);
        this.leaveAfterThisPage();
        this.visibleThisPage();
    }

    override leaveAfterThisPage(): void {
        this.leaveThisPage();
        this.nextPageAndBreadcrumbList?.leaveAfterThisPage();
    }
}
/** This is required for the last page of the SPA. */
export abstract class LastPageAndBreadcrumbList extends PageAndBreadcrumbListBase {
    comeToThisPage(): void {
        this.breadcrumbList.addLast(this.pageBreadCrumb);
        this.visibleThisPage();
    }

    override leaveAfterThisPage(): void {
        this.leaveThisPage();
    }
}
/** This is required for the middle page of the SPA. */
export abstract class PageAndBreadcrumbList extends FirstPageAndBreadcrumbList implements LastPageAndBreadcrumbList {
    comeToThisPage(): void {
        this.breadcrumbList.addLast(this.pageBreadCrumb);
        this.visibleThisPage();
    }
}
