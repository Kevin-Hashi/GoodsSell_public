import { EmptyOrderError } from "./Errors";
import { ItemList } from "./itemList";
import { DefinedType, ItemColWithSize, ItemData, KeyOfGetInitSheetDataSheetNames, KeyOfItemGroupType, NumOfItems, PropertyCol, RowData, SheetData } from "./type";

/**
 * @example zip([0, 1, 2, 3, 4], [5, 6, 7, 8, 9]); // returns [[0, 5], [1, 6], [2, 7], [3, 8], [4, 9]]
 */
const zip = <T>(...arrays: T[][]): T[][] => {
    const length = Math.min(...(arrays.map(arr => arr.length)));
    return Array(length).fill(undefined).map((_, i) => arrays.map(arr => arr[i]) as T[]);
};

/** The system is designed to conduct sales. */
export class SellSystem {

    protected sheetId: string = "";
    protected orderSheetName: string = "";

    protected readonly itemList = new ItemList();

    /**
     * @example const sellSystem = new SellSystem(scriptUrl);
     */
    constructor(protected readonly scriptUrl: RequestInfo | URL, protected readonly fetchRetryCount: number = 10) { }

    /**
     * Set the sheetId(for SpreadSheet).
     * 
     * @example sellSystem.setSheetId("sheetId");
     */
    setSheetId(sheetId: string): void {
        this.sheetId = sheetId;
    }

    /**
     * Set the orderSheetName.
     * 
     * @example sellSystem.setOrderSheetName("OrderSheetName");
     */
    setOrderSheetName(sheetName: string): void {
        this.orderSheetName = sheetName;
    }

    protected _propertyCol!: PropertyCol;

    /** The data necessary for initialization is taken and set up. */
    protected getInitData(sheetData: { [key in KeyOfGetInitSheetDataSheetNames]: SheetData; }): void {
        const { itemList: itemListData, itemGroup: itemGroupData, property: propertyData } = sheetData;
        console.log(itemListData, itemGroupData, propertyData);
        itemGroupData.slice(1).forEach(cellArray => {
            const itemColList = cellArray[2] ? zip(String(cellArray[1]).split(','), String(cellArray[2]).split(',')).map(([itemCol, sizeCol]) => ({ itemCol: Number(itemCol), sizeCol: Number(sizeCol) })) : String(cellArray[1]).split(',').map(itemCol => ({ itemCol: Number(itemCol) }));
            const type = (Object.keys(DefinedType.ItemGroupType) as KeyOfItemGroupType[]).find(key => DefinedType.ItemGroupType[key] === cellArray[3]);
            if (!type) throw TypeError();//IMPLEMENT Error message
            this.itemList.addItemGroup({ name: String(cellArray[0]), itemColList, type });
        });
        console.table(itemListData);
        const itemDataList = itemListData.slice(1).map((record): ItemData => ({ name: String(record[1]), price: Number(record[2]), itemGroupName: String(record[0]), size: String(record[3]) }));
        console.table(itemDataList);
        itemDataList.forEach(itemData => this.itemList.addItem(itemData));
        console.table(this.itemList);

        console.table(propertyData);
        const propertySet = propertyData.reduce((map, property) => map.set(String(property[0]), Number(property[1])), new Map<string, number>());

        const mailAddressCol = SellSystem.getMapWithoutUndefined(propertySet, "メールアドレス");
        const orderNumberCol = SellSystem.getMapWithoutUndefined(propertySet, "注文番号");
        const nameCol = SellSystem.getMapWithoutUndefined(propertySet, "名前");
        const boughtCol = SellSystem.getMapWithoutUndefined(propertySet, "購入済み");
        const studentNumberCol = SellSystem.getMapWithoutUndefined(propertySet, "学籍番号");
        const timestampCol = SellSystem.getMapWithoutUndefined(propertySet, "タイムスタンプ");
        this._propertyCol = {
            mailAddress: mailAddressCol,
            orderNumber: orderNumberCol,
            name: nameCol,
            bought: boughtCol,
            studentNumber: studentNumberCol,
            timestamp: timestampCol
        };
    }

    /** Get data from map. If the data is `undefined`, throws an exception. */
    private static getMapWithoutUndefined<T, S>(map: Map<T, S>, key: T): S | never {
        const value = map.get(key);
        if (value === undefined) throw Error(`Map does not contain key: ${key}`);
        return value;
    }

    /**
     * Interpret order data.
     * The data given in the line data is processed by what is set during initialization.
     */
    protected parseOrder(order: RowData): [Map<ItemData, number>, number] {
        const numOfItems = new Map<ItemData, number>();
        console.table(order);
        if (!order) throw new EmptyOrderError("Order not found");
        this.itemList.forEachItemGroupMap(group => {
            group.itemColList.forEach(cols => {
                if (!order[cols.itemCol]) return;
                if (DefinedType.ItemGroupType[group.type] === DefinedType.ItemGroupType.ByName) {
                    const item = this.itemList.getItemDataMap(group)?.get(ItemList.createItemDataId({ name: String(order[cols.itemCol]), size: String(cols.hasOwnProperty("sizeCol") ? order[(cols as ItemColWithSize).sizeCol] : ""), itemGroupName: group.name }));
                    if (!item) throw TypeError;//TODO
                    SellSystem.addOrderItem(item, 1, numOfItems);
                } else if (DefinedType.ItemGroupType[group.type] === DefinedType.ItemGroupType.ByQuantity) {
                    const item = this.itemList.getItemDataMap(group)?.get(ItemList.createItemDataId({ name: group.name, itemGroupName: group.name, size: "" }));
                    if (!item) throw TypeError;//TODO
                    const orderNumberCellSpilited = String(order[cols.itemCol]).split(/\D+/);
                    if (orderNumberCellSpilited[0] === undefined) throw Error("itemCol is undefined");
                    SellSystem.addOrderItem(item, Number(orderNumberCellSpilited[0].replace(/\D+/, '')), numOfItems);
                } else {
                    throw TypeError;
                }
            });
        });
        console.log(numOfItems);
        numOfItems.forEach((value, key) => { if (value === 0) numOfItems.delete(key); });
        const price = [...numOfItems.entries()].reduce((p, [itemData, value]) => p + itemData.price * value, 0);
        console.log(price.toLocaleString());
        return [numOfItems, price];
    }

    /** Increase the order quantity. */
    private static addOrderItem(item: ItemData, num: number, numOfItem: NumOfItems): void {
        const current = numOfItem.get(item);
        numOfItem.set(item, (current || 0) + num);
    }
}
