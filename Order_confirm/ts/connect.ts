import { GASfetchError } from "./Errors";
import { SheetIdAndSS_API_URL } from "./type/SheetIdAndSS_API_URL";

/** This is an easy-to-use summary of `UrlFetchApp`. */
export class FetchUtils {
    /** For post communication. */
    static fetchRetry(url: string, headers: { [key: string]: any; } | undefined, payload: { [key: string]: any; } | undefined, /** trueで終了 */endDetector: (response: GoogleAppsScript.URL_Fetch.HTTPResponse) => boolean, retry: number = 10): GoogleAppsScript.URL_Fetch.HTTPResponse | never {
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            method: 'post',
            headers
        };
        if (payload) options.payload = JSON.stringify(payload);
        return FetchUtils.fetchRetryBase(url, options, endDetector, retry);
    }
    /** For get communication. */
    static fetchRetryGET(url: string, headers: { [key: string]: any; } | undefined, payload: { [key: string]: any; } | undefined, /** trueで終了 */endDetector: (response: GoogleAppsScript.URL_Fetch.HTTPResponse) => boolean, retry: number = 10): GoogleAppsScript.URL_Fetch.HTTPResponse | never {
        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            method: 'get',
            headers,
        };
        if (payload) options.payload = JSON.stringify(payload);
        return FetchUtils.fetchRetryBase(url, options, endDetector, retry);
    }
    /** This is the common part of GET and POST. */
    static fetchRetryBase(url: string, options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions, endDetector: (response: GoogleAppsScript.URL_Fetch.HTTPResponse) => boolean, retry: number = 10): GoogleAppsScript.URL_Fetch.HTTPResponse | never {
        return (function () {
            let response;
            for (let i = 0; i < retry; i++) {
                response = UrlFetchApp.fetch(url, options);
                if (endDetector(response)) return response;
            }
            throw new GASfetchError("fetch Error!" + response?.getContentText());
        }());
    }
}

/** This is put together for when you use SS_API. */
export class SS_API_FetchUtils {
    constructor(private readonly sheetIdAndSS_API_URL: SheetIdAndSS_API_URL, private readonly retry: number = 10) { }
    private endDetector = (response: GoogleAppsScript.URL_Fetch.HTTPResponse): boolean => JSON.parse(response.getContentText()).status === 0;
    /** For post communication. */
    fetchRetry(headers: { [key: string]: any; } | undefined, payload: { [key: string]: any; } | undefined): GoogleAppsScript.URL_Fetch.HTTPResponse | never {
        return FetchUtils.fetchRetry(this.sheetIdAndSS_API_URL.SS_API_URL, headers, payload, (response) => this.endDetector(response), this.retry);
    }
    /** For get communication. */
    fetchRetryGET(headers: { [key: string]: any; } | undefined, payload: { [key: string]: any; } | undefined): GoogleAppsScript.URL_Fetch.HTTPResponse | never {
        return FetchUtils.fetchRetryGET(this.sheetIdAndSS_API_URL.SS_API_URL, headers, payload, (response) => this.endDetector(response), this.retry);
    }
}
