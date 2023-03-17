/**
 * Displays toast at the time of payment.
 *
 * @see {@link https://materializecss.com/toasts.html}
 *
 * @example const paymentToast = new PaymentToast();
 */
export class PaymentToast {
    /**
     * @example paymentToast.orderNUmber = "12345";
     */
    orderNumber: string = "";
    /**
     * Displays toast when payment is completed.
     */
    accept(): void {
        M.toast({ html: `注文番号:${this.orderNumber}に決済済みを記録しました。` });
    }
    /**
     * Displays toast when payment is rejected.
     */
    reject(): void {
        M.toast({ html: `注文番号:${this.orderNumber}の決済をキャンセルしました。` });
    }
}
