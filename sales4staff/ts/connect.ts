import { GASfetchError } from "./Errors";

/**
 * Used for tapping SS_API.
 * When an error occurs, it is redone for the number of `n` times.
 */
export async function GASfetchRetry(url: RequestInfo | URL, data: BodyInit | null, n: number): Promise<{ [key: string]: any; }> {
    let response;
    for (let i = 0; i < n; i++) {
        response = await getJSONfromFetch(postFetchCreator(url, data));
        if (response.status === 0) return response;
    }
    throw new GASfetchError("fetch Error! response:" + JSON.stringify(response));
}

/** Get JSON from fetch. */
async function getJSONfromFetch(responsePromise: Promise<Response>): Promise<{ [key: string]: any; }> {
    const response = await responsePromise;
    const json = await response.json();
    return json;
}

/** Create a POST fetch. */
async function postFetchCreator(url: RequestInfo | URL, data?: BodyInit | null, headers?: HeadersInit): Promise<Response> {
    const option: RequestInit = {
        method: "POST",
        headers: headers,
        body: data
    };
    return fetch(url, option);
}
