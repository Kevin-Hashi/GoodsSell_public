//@ts-check
///<reference path="type.ts"/>
///<reference path="sheet_name.js" />
///<reference path="itemlist.js" />
/**
 * @template T
 * @param {...T[]} arrays
 * @returns {T[][]}
 */
const zip = (...arrays) => {
    const length = Math.min(...(arrays.map(arr => arr.length)));
    return new Array(length).fill(undefined).map((_, i) => arrays.map(arr => arr[i]));
};

const itemList = new ItemList();
/** @type {number | null} */
let orderNumber = null;
window.onload = () => {
    let count = 0;
    const scriptUrl = "SS_APIのURL";
    // @ts-ignore
    document.getElementById("submit").onclick = async function () {
        console.log("submit clicked");
        // @ts-ignore
        const sheetId = getSheetId();
        const response = await getAllSheetNames(sheetId, scriptUrl);
        const sheetNames = response.data.sheetsName;
        console.log(sheetNames);
    };
    // @ts-ignore
    document.getElementById("add").onclick = function () {
        console.log("add clicked");
        const empty8 = Array(8).fill("");
        fetchRetry(scriptUrl, {
            oprationType: "ADD_ORDER",
            sheetData: {
                // @ts-ignore
                sheetId: getSheetId(),
                sheetName: "注文内容",
            },
            addData: {
                data: [
                    [
                        count,
                        "2023/01/22",
                        "hoge",
                        "hoge@example.com",
                    ].concat(empty8),
                ],
            },
        }, 10);
        count += 1;
    };
    //@ts-ignore
    document.getElementById("submitItemListAndGroup").onclick = async function () {
        const { itemList: itemListData, itemGroup: itemGroupData } = await getItemListAndGroup(scriptUrl, getSheetId());
        console.log(itemGroupData);
        for (const itemG of itemGroupData.slice(1)) {
            const itemColList = itemG[2] ? zip(String(itemG[1]).split(','), String(itemG[2]).split(',')).map(/** @returns {ItemColWithSize} */([itemCol, sizeCol]) => ({ itemCol: Number(itemCol), sizeCol: Number(sizeCol) })) : String(itemG[1]).split(',').map(/** @returns {ItemCol} */itemCol => ({ itemCol: Number(itemCol) }));
            itemList.addItemGroup({ name: itemG[0], itemColList: itemColList });
        }
        console.table(itemListData);
        const itemDataList = itemListData.slice(1).map(/** @returns {ItemData} */record => ({ name: record[1], price: record[2], itemGroup: record[0], size: record[3] }));
        console.table(itemDataList);
        itemDataList.forEach(itemData => itemList.addItem(itemData));
        console.log(itemList);
    };
    //@ts-ignore
    document.getElementById("submitOrderItem").onclick = async function () {
        /** @type {NumOfItems} */
        const numofItems = new Map();
        const order = await getOrder(scriptUrl, getSheetId());
        console.table(order);
        orderNumber = Number(order[1]);
        itemList.itemGroup.forEach((group, groupName) => {
            group.itemColList.forEach((itemCol) => {
                if (!order[itemCol.itemCol]) return;
                const itemGroup = itemList.itemGroup.get(groupName);
                if (!itemGroup) throw TypeError();
                if ("sizeCol" in itemCol) {
                    console.log(groupName, order[itemCol.itemCol], order[itemCol.sizeCol]);
                    const item = itemList.itemDataGroup.get(itemGroup)?.get(createItemDataId({ name: String(order[itemCol.itemCol]), size: String(order[itemCol.sizeCol]), itemGroup: groupName }));
                    if (!item) throw TypeError();
                    addOrderItem(item, 1, numofItems);
                } else {
                    console.log(groupName, "How much:", order[itemCol.itemCol]);
                    const item = itemList.itemDataGroup.get(itemGroup)?.get(createItemDataId({ name: groupName, itemGroup: groupName, size: "" }));
                    if (!item) throw TypeError();
                    addOrderItem(item, Number(order[itemCol.itemCol]), numofItems);//FIXME 第2引数をitemNameにする
                }
            });
        });
        console.log(numofItems);
        numofItems.forEach((value, key) => console.log(key, value));
    };
    //@ts-ignore
    //TODO すでに決済済みの時の処理
    document.getElementById("submitCompletePayment").onclick = async function () {
        if (!Number.isInteger(orderNumber)) throw TypeError();
        //@ts-ignore
        if (orderNumber < 0) throw TypeError();
        await fetchRetry(scriptUrl, {
            oprationType: "EDIT_ORDER",
            sheetData: {
                sheetId: getSheetId(),
                sheetName: getHTMLInputElement("sheetNameOrderList")?.value
            },
            editData: {
                col: 1, finder: orderNumber, editCol: 0, value: true
            }
        }, 10);
        console.log("complete payment");
    };
};

/**
 * @param {ItemData} item
 * @param {number} num
 * @param {NumOfItems} numofItems
 */
function addOrderItem(item, num, numofItems) {
    const current = numofItems.get(item);
    numofItems.set(item, (current ? current : 0) + num);
}

/**
 * @returns {string}
 */
function getSheetId() {
    //@ts-ignore
    return document.getElementById("sheetId").value;
}

/**
 * @param {RequestInfo | URL} scriptUrl
 * @param {string} sheetId
 */
async function getOrder(scriptUrl, sheetId) {
    const sheetNameOrder = getHTMLInputElement("sheetNameOrderList")?.value;
    if (!sheetNameOrder) throw new Error();
    const orderNumberString = getHTMLInputElement("orderNumber")?.value;
    if (!orderNumberString) throw new Error();
    const orderNumber = Number(orderNumberString);
    const orderPromise = fetchRetry(scriptUrl, {
        oprationType: "GET_ORDER",
        sheetData: {
            sheetId: sheetId,
            sheetName: sheetNameOrder
        },
        getData: {
            col: 1,
            finder: orderNumber
        }
    }, 10);
    /** @type {SheetData} */
    const order = (await orderPromise).data.recordData.data;
    return order;
}

/**
 * @param {RequestInfo | URL} scriptUrl
 * @param {string} sheetId
 */
async function getOrderList(scriptUrl, sheetId) {
    const sheetNameOrder = getHTMLInputElement("sheetNameOrderList")?.value;
    if (!sheetNameOrder) throw new Error();
    const orderListPromise = fetchRetry(scriptUrl, {
        oprationType: "GET_SHEET_DATA",
        sheetData: {
            sheetId: sheetId,
            sheetName: sheetNameOrder
        }
    }, 10);

    /** @type {SheetData} */
    const orderList = (await orderListPromise).data.sheetData;

    return orderList;
}

/**
 * @param {RequestInfo | URL} scriptUrl
 * @param {string} sheetId
 */
async function getItemListAndGroup(scriptUrl, sheetId) {
    const sheetNameItemList = getHTMLInputElement("sheetNameItemList")?.value;
    const sheetNameItemGroup = getHTMLInputElement("sheetNameItemGroup")?.value;
    if (!sheetNameItemList || !sheetNameItemGroup) throw new Error();
    const itemListPromise = fetchRetry(scriptUrl, {
        oprationType: "GET_SHEET_DATA",
        sheetData: {
            sheetId: sheetId,
            sheetName: sheetNameItemList
        }
    }, 10);
    const itemGroupPromise = fetchRetry(scriptUrl, {
        oprationType: "GET_SHEET_DATA",
        sheetData: {
            sheetId: sheetId,
            sheetName: sheetNameItemGroup
        }
    }, 10);
    /** @type {SheetData} */
    const itemList = (await itemListPromise).data.sheetData;
    /** @type {SheetData} */
    const itemGroup = (await itemGroupPromise).data.sheetData;
    return { itemList, itemGroup };
}
/**
 * @param {string} id
 * @returns {HTMLInputElement|null}
 */
function getHTMLInputElement(id) {
    //@ts-ignore
    return document.getElementById(id);
};
