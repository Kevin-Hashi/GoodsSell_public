//@ts-check
/**
 * @param {RequestInfo | URL} url
 * @param {any} data
 * @param {number} n
 * @returns {Promise<{[key:string]:any}>}
 */
async function fetchRetry(url, data, n) {
    const responseData = await getJSONfromfetch(fetchCreater(url, data));
    if (responseData.status === 0) return responseData;
    if (n === 0) throw Error;
    return await fetchRetry(url, data, n - 1);
}

/**
 * @param {Promise<Response>} responsePromise
 * @returns {Promise<{[key:string]:any}>}
 */
async function getJSONfromfetch(responsePromise) {
    const response = await responsePromise;
    const json = await response.json();
    return json;
}

/**
 * @param {RequestInfo | URL} url
 * @param {any} data
 * @returns {Promise<Response>}
 */
function fetchCreater(url, data) {
    /** @type {RequestInit} */
    const option = {
        method: "POST",
        body: JSON.stringify(data)
    };
    return fetch(url, option);
}
