import { Breadcrumb, BreadcrumbList } from "./Breadcrumb";
import { CheckDigit } from "./CheckDigit";
import { GetElement } from "./ElementGet";
import { EmptyOrderError, GASfetchError, InvalidOrderNumberError } from "./Errors";
import { AlreadyPaidModal, ErrorModal, OrderItemModal } from "./Modal";
import { LastPageAndBreadcrumbList } from "./PageAndBreadcrumbList";
import { SellSystemForWeb } from "./SellSystemForWeb";
import { TableBody, TableHead, Td, TextContent, Th, Tr } from "./TableElement";
import { PaymentToast } from "./toast";
import { ItemData } from "./type";

/** 
 * Page 3
 * First, enter the name of the sheet on which the order is written.
 * Then let's get the order details.
 */
export class OrderNumberPage extends LastPageAndBreadcrumbList {
    errorModal!: ErrorModal;
    alreadyPaidModal!: AlreadyPaidModal;
    orderItemModal!: OrderItemModal;
    readonly paymentToast = new PaymentToast();
    constructor(pageId: string, pageBreadCrumb: Breadcrumb, breadcrumbList: BreadcrumbList, protected readonly sellSystem: SellSystemForWeb, protected readonly sheetNameId: string, protected readonly orderNumberInputId: string) {
        super(pageId, pageBreadCrumb, breadcrumbList);
    }

    /**
     * When the button is pressed, the order is taken from the sheet with the order details.
     * The order is then parsed and displayed on the screen.
     * Be quick, or customers will be waiting in line.
     */
    async action(): Promise<void> {
        const orderData = (function (thisArg: OrderNumberPage) {
            try {
                return thisArg.getOrderData();
            } catch (e) {
                if (e instanceof GASfetchError) {
                    if (thisArg.errorModal) {
                        thisArg.errorModal.open("Sheet not found!" + e.message);
                    }
                } else if (e instanceof EmptyOrderError) {
                    if (thisArg.errorModal) {
                        thisArg.errorModal.open(e.message);
                    }
                } else if (e instanceof InvalidOrderNumberError) {
                    if (thisArg.errorModal) {
                        thisArg.errorModal.open("Invalid order number! " + e.message);
                    }
                } else if (e instanceof SyntaxError) {
                    if (thisArg.errorModal) {
                        thisArg.errorModal.open(e.message);
                    }
                }
                throw e;
            }
        })(this);
        const orderNumber = orderData.orderNumber;
        const data = await orderData.data;

        if (data.alreadyPaid) {
            this.alreadyPaidModal.open(String(orderNumber));
        } else {
            this.paymentToast.orderNumber = orderNumber.toString();
            const thead = new TableHead();
            const theadtr = new Tr()
                .appendChild(new Th().appendChild(new TextContent("商品種別")))
                .appendChild(new Th().appendChild(new TextContent("商品名")))
                .appendChild(new Th().appendChild(new TextContent("商品仕様")))
                .appendChild(new Th().appendChild(new TextContent("数量")))
                .appendChild(new Th().appendChild(new TextContent("小計")));
            thead.appendChild(theadtr);

            const tbody = new TableBody();
            data.data[0].forEach((value, itemData) => {
                const tr = new Tr()
                    .appendChild(new Td().appendChild(new TextContent(itemData.itemGroupName)))
                    .appendChild(new Td().appendChild(new TextContent(itemData.name)))
                    .appendChild(new Td().appendChild(new TextContent(itemData.size)))
                    .appendChild(new Td().appendChild(new TextContent(value.toLocaleString())))
                    .appendChild(new Td().appendChild(new TextContent((itemData.price * value).toLocaleString())));
                tbody.appendChild(tr);
            });

            this.orderItemModal.open({ totalAmount: data.data[1].toLocaleString(), orderItemTHead: thead, orderItemTBody: tbody });
        }
    }

    /** 
     * Retrieve order details.
     * The order number and contents will be returned.
     */
    private getOrderData(): { orderNumber: number; data: Promise<{ data: [Map<ItemData, number>, number]; alreadyPaid: boolean; }>; } {
        const orderSheetName = GetElement.getHTMLInputElement(this.sheetNameId).value;
        this.sellSystem.setOrderSheetName(orderSheetName);
        const orderNumberString = GetElement.getHTMLInputElement(this.orderNumberInputId).value;
        if (!orderNumberString) throw Error("orderNumber must not be empty");
        if (!new CheckDigit.Damm().validate(orderNumberString)) throw new InvalidOrderNumberError("Invalid order number: " + orderNumberString);
        const orderNumber = Number(orderNumberString);
        const data = this.sellSystem.orderItem(orderNumber);
        return { orderNumber, data };
    }

    /** After payment is made, it will be executed. */
    async acceptPayment(): Promise<void> {
        try {
            await this.sellSystem.recordBought(Number(this.paymentToast.orderNumber));
        } catch (e) {
            if (e instanceof GASfetchError) {
                this.errorModal.open(e.message);
            }
            throw e;
        }
        this.paymentToast.accept();
        this.onCloseToastOnPayment();
    }
    /** When the payment is cancelled, it will be executed. */
    rejectPayment(): void {
        this.paymentToast.reject();
        this.onCloseToastOnPayment();
    }

    private onCloseToastOnPayment(): void {
        const inputElement = GetElement.getHTMLInputElement(this.orderNumberInputId);
        inputElement.value = "";
        inputElement.focus();
    }
}
