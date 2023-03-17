import { Breadcrumb, BreadcrumbList } from './Breadcrumb';
import { GetElement } from './ElementGet';
import { AlreadyPaidModal, ErrorModal, OrderItemModal } from './Modal';
import { OrderNumberPage } from './OrderNumberPage';
import { SellSystemForWeb } from './SellSystemForWeb';
import { SheetIDPage } from './SheetIDPage';
import { SheetNameID, SheetNamePage } from './SheetNamePage';

const sheetIdPageId = "sheetIdPage";
const sheetNamePageId = "sheetNamePage";
const orderPageLoaderId = "orderPageLoader";
const errorModalId = "errorModal";
const alreadyPaidModalId = "alreadyPaidModal";
const orderItemModalId = "orderItemModal";
const orderPageId = "orderPage";

const getHTMLButtonElement = GetElement.getHTMLButtonElement;
const getHTMLInputElement = GetElement.getHTMLInputElement;
const getHTMLDivElement = GetElement.getHTMLDivElement;

const sheetIdPageBreadcrumbId = "sheetIdPageBreadcrumb";
const sheetNamePageBreadcrumbId = "sheetNamePageBreadcrumb";
const orderPageBreadcrumbId = "orderPageBreadcrumb";

const breadcrumbCssClass = ["breadcrumb"];
const sheetIdPageBreadcrumb = new Breadcrumb(sheetIdPageBreadcrumbId, breadcrumbCssClass, "Set SheetID");
const sheetNamePageBreadcrumb = new Breadcrumb(sheetNamePageBreadcrumbId, breadcrumbCssClass, "Set Sheet Name");
const orderPageBreadcrumb = new Breadcrumb(orderPageBreadcrumbId, breadcrumbCssClass, "Order");

const breadcrumbContainer = getHTMLDivElement("breadcrumb-wrapper");

const breadcrumbList = new BreadcrumbList(breadcrumbContainer, sheetIdPageBreadcrumb);

window.onload = () => {
    const errorModal = new ErrorModal(GetElement.getHTMLDivElement(errorModalId));
    errorModal.errorModalMessageId = "errorMessage";
    const alreadyPaidModal = new AlreadyPaidModal(GetElement.getHTMLDivElement(alreadyPaidModalId));
    alreadyPaidModal.alreadyPaidOrderNumberId = "alreadyPaidOrderNumber";
    const orderItemModal = new OrderItemModal(GetElement.getHTMLDivElement(orderItemModalId));
    orderItemModal.orderTableId = { theadId: "orderItemThead", tbodyId: "orderItemTbody" };
    orderItemModal.orderTotalAmountId = "orderTotalAmount";

    const sellSystem = new SellSystemForWeb("SS_API_URL");

    const sheetId2 = new SheetIDPage(sheetIdPageId, sheetIdPageBreadcrumb, breadcrumbList, sellSystem, "sheetId");

    getHTMLDivElement("breadcrumb-wrapper").appendChild(sheetIdPageBreadcrumb.element);

    const sheetNameID: SheetNameID = {
        sheetNameItemList: "sheetNameItemList",
        sheetNameItemGroup: "sheetNameItemGroup",
        sheetNameProperty: "sheetNameProperty"
    };
    const sheetName = new SheetNamePage(sheetNamePageId, sheetNamePageBreadcrumb, breadcrumbList, orderPageLoaderId, sellSystem, sheetNameID);
    sheetName.errorModal = errorModal;

    const orderNumber = new OrderNumberPage(orderPageId, orderPageBreadcrumb, breadcrumbList, sellSystem, "sheetNameOrder", "orderNumber");
    orderNumber.errorModal = errorModal;
    orderNumber.alreadyPaidModal = alreadyPaidModal;
    orderNumber.orderItemModal = orderItemModal;

    sheetId2.nextPageAndBreadcrumbList = sheetName;
    sheetName.nextPageAndBreadcrumbList = orderNumber;

    getHTMLButtonElement("sheetIdButton").onclick = () => sheetId2.action();
    getHTMLButtonElement("sheetNameButton").onclick = async () => { await sheetName.action(); getHTMLInputElement("orderNumber").focus(); };
    getHTMLButtonElement("orderNumberButton").onclick = () => orderNumber.action();

    getHTMLInputElement("sheetId").onkeydown = onEnterClicked(() => sheetId2.action());
    getHTMLInputElement("orderNumber").onkeydown = onEnterClicked(() => orderNumber.action());

    sheetIdPageBreadcrumb.onclick = () => sheetId2.backToThisPage();
    sheetNamePageBreadcrumb.onclick = () => sheetName.backToThisPage();

    GetElement.getHTMLSpanElement("rejectPayment").onclick = () => orderNumber.rejectPayment();
    GetElement.getHTMLSpanElement("acceptPayment").onclick = () => orderNumber.acceptPayment();

    function onEnterClicked(func: () => any): (e: KeyboardEvent) => void {
        return (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                func();
            }
        };
    }
};
