/**
 * Creates a QR code and returns it in base64.
 * This uses {@link https://goqr.me/api/doc/create-qr-code/}.
 */
export class CreateQR {
    /** Main body. */
    static createQR(data: string): string {
        const QRApiUrl = "https://api.qrserver.com/v1/create-qr-code/";
        const QRParameters = {
            ecc: "Q",
            size: "150x150",
            data: data
        };
        const QRParametersString = CreateQR.QueryString(QRParameters);
        const option: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            method: "get"
        };
        const blob = UrlFetchApp.fetch(QRApiUrl + '?' + QRParametersString, option).getBlob();

        const b64Data = Utilities.base64Encode(blob.getBytes());
        return b64Data;
    }
    /** Converts an object to a URL parameter. */
    private static QueryString(obj: { [x: string]: string; }, encode?: any): string {
        // :param encode use encodeURIComponent default:false
        return Object.keys(obj).map(function (key) {
            if (encode) {
                return key + '=' + encodeURIComponent(obj[key] as (string | number | boolean));
            } else {
                return key + '=' + obj[key];
            }
        }).join('&');
    }
}
