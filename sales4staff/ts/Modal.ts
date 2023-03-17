import { GetElement } from "./ElementGet";
import { TableBody, TableHead } from "./TableElement";

/**
 * This modal is used when some error occurs.
 *
 * @see {@link https://materializecss.com/modals.html}
 *
 * @example const errorModal = new ErrorModal();
 */
export class ErrorModal extends M.Modal {
    /**
     * Be sure to assign an ID before using other functions.
     *
     * @example errorModal.errorModalMessageId = "errorModalMessageId";
     */
    errorModalMessageId!: string;
    /**
     * Display with error messages.
     *
     * @example try{
     *     ...
     * } catch (e) {
     *     if(e instanceof Error){
     *         errorModal.open(e.message);
     *     }
     *     throw e;
     * }
     */
    override open(errorModalMessage: string): void;
    /**
     * This function ALWAYS throws a `TypeError`.
     * @deprecated
     */
    override open(): never;
    override open(errorModalMessage?: string): void {
        if (errorModalMessage === undefined) throw TypeError;
        GetElement.getHTMLParagraphElement(this.errorModalMessageId).textContent = errorModalMessage;
        super.open();
    }
    /**
     * Erase the error message and close the modal.
     * Generally, it is called automatically when Modal is closed.
     *
     * @example errorModal.close();
     */
    override close(): void {
        GetElement.getHTMLParagraphElement(this.errorModalMessageId).textContent = "";
        super.close();
    }
}

/**
 * This modal is displayed when the payment has already been made.
 *
 * @see {@link https://materializecss.com/modals.html}
 *
 * @example const alreadyPaidModal = new AlreadyPaidModal();
 */
export class AlreadyPaidModal extends M.Modal {
    /**
     * Be sure to assign an ID before using other functions.
     *
     * @example alreadyPaidModal.alreadyPaidOrderNumberId = "alreadyPaidOrderNumberId";
     */
    alreadyPaidOrderNumberId!: string;
    /**
     * Display with order number.
     *
     * @example alreadyPaidModal.open('12345');
     */
    override open(alreadyPaidOrderNumber: string): void;
    /**
     * This function ALWAYS throws a `TypeError`.
     * @deprecated
     */
    override open(): never;
    override open(alreadyPaidOrderNumber?: string): void {
        if (alreadyPaidOrderNumber === undefined) throw TypeError;
        GetElement.getHTMLParagraphElement(this.alreadyPaidOrderNumberId).textContent = alreadyPaidOrderNumber;
        super.open();
    }
    /**
     * Generally, it is called automatically when Modal is closed.
     * Erase the order number and close the modal.
     *
     * @example alreadyPaidModal.close();
     */
    override close(): void {
        GetElement.getHTMLParagraphElement(this.alreadyPaidOrderNumberId).textContent = "";
        super.close();
    }
}

/**
 * This modal displays order details and total amount.
 *
 * @see {@link https://materializecss.com/modals.html}
 *
 * @example const orderItemModal = new OrderItemModal();
 */
export class OrderItemModal extends M.Modal {
    /**
     * Be sure to assign an ID before using other functions.
     *
     * @example orderTotalAmountId = "orderTotalAmountId";
     */
    orderTotalAmountId!: string;
    /**
     * Be sure to assign an IDs before using other functions.
     *
     * @example orderTableId = { thead: "theadId", tbody: "tbodyId" };
     */
    orderTableId!: { theadId: string, tbodyId: string; };
    /**
     * Display with order details and total amount.
     *
     * @example orderItemModal.open({ totalAmount: '3,000', orderItemTHead, orderItemTBody });
     */
    override open(orderData: { totalAmount: string, orderItemTHead: TableHead, orderItemTBody: TableBody; }): void;
    /**
     * This function ALWAYS throws a `TypeError`.
     * @deprecated
     */
    override open(): never;
    override open(orderData?: { totalAmount: string, orderItemTHead: TableHead, orderItemTBody: TableBody; }): void {
        if (!orderData) throw TypeError;
        GetElement.getHTMLElement(this.orderTotalAmountId).textContent = orderData.totalAmount;
        GetElement.getHTMLElement(this.orderTableId.theadId).innerHTML = orderData.orderItemTHead.toHtml();
        GetElement.getHTMLElement(this.orderTableId.tbodyId).innerHTML = orderData.orderItemTBody.toHtml();
        super.open();
    }
    /**
     * Generally, it is called automatically when Modal is closed.
     * Erase the order details and total amount.
     *
     * @example orderItemModal.close();
     */
    override close(): void {
        GetElement.getHTMLElement(this.orderTableId.theadId).innerHTML = "";
        GetElement.getHTMLElement(this.orderTableId.tbodyId).innerHTML = "";
        super.close();
    }
}
