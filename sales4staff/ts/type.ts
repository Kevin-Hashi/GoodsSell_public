/** This is what is in the cells of the spreadsheet. */
export type cell = string | number | boolean;
/** It is a collection of `cell` horizontally. */
export type RowData = cell[];
/** It is a collection of `RowData` vertically. */
export type SheetData = RowData[];

/** It contains column numbers for items of type `個数`. */
export interface ItemCol extends Object {
    itemCol: number;
}

/** It contains column numbers for items of type `名前`. */
export interface ItemColWithSize extends ItemCol {
    sizeCol: number;
}

/** A list of either `ItemColList` or `ItemColWithList`. */
export type ItemColList = (ItemCol | ItemColWithSize)[];

/** The type as an item group. */
export interface ItemGroup {
    name: string;
    itemColList: ItemColList;
    type: KeyOfItemGroupType;
}

/** This is a map of the item group with the name of the item group as the key. */
export class ItemGroupMap extends Map<string, ItemGroup>{ };

/** The ID type of the item. This program probably uses only `string`. */
export type ItemDataId = string | number;

/** The type that defines the item. It is used where no amount is required (where the ID of the item is created). */
export interface ItemDataBase {
    name: string;
    itemGroupName: string;
    size: string;
}
/** The type that defines the item. Used in most places. */
export interface ItemData extends ItemDataBase {
    price: number;
}

/** A map of the item, keyed to the item's ID. */
export class ItemDataMap extends Map<ItemDataId, ItemData>{ };
/** A map of `ItemDataMap` with item groups as keys. */
export class ItemDataGroup extends Map<ItemGroup, ItemDataMap>{ };

/** This is a map of that quantity with the item as the key. */
export type NumOfItems = Map<ItemData, number>;

export namespace DefinedType {
    /** Used for SS_API oprationConf. */
    export const oprationConf = {
        GET_ORDER: "GET_ORDER",
        ADD_ORDER: "ADD_ORDER",
        EDIT_ORDER: "EDIT_ORDER",
        EDIT_ORDER_BY_FINDER: "EDIT_ORDER_BY_FINDER",
        ADD_SHEET_NAME: "ADD_SHEET_NAME",
        GET_SHEETS_NAME: "GET_SHEETS_NAME",
        GET_SHEET_DATA: "GET_SHEET_DATA",
    } as const;
}

/** Stores the sheet ID and sheet name. */
export interface SheetIdName {
    sheetId: string;
    sheetName?: string;
}
/** The base of the body when making a request to SS_API. */
export interface GASRequestBodyTypeBase {
    oprationType: typeof DefinedType.oprationConf[keyof typeof DefinedType.oprationConf];
    data: {
        sheetData: SheetIdName;
    };
};

/** Common part of data when doing `oprationConf.ADD_ORDER`. */
interface AddRecordDataBase {
    row?: number;
}
/** This is when there is a single line of data in `oprationConf.ADD_ORDER`. */
interface AddRecordData extends AddRecordDataBase {
    data: cell[];
}
/** This is when there are multiple rows of data in `oprationConf.ADD_ORDER`. */
interface AddRecordDataArray extends AddRecordDataBase {
    data: cell[][];
}

/** Data when doing `oprationConf.EDIT_ORDER`. */
export type EditRecordData = {
    data: cell;
    row: number;
    col: number;
}[];

/**
 * Use `oprationConf.EDIT_ORDER_BY_FINDER` to search and rewrite the elements of the line.
 * For example, it is used to search by order number and mark a hit as settled.
 */
export interface EditByFinderRecordData extends RecordGet {
    editCol: number;
    value: cell;
}

/** The `data` part when doing `oprationConf.ADD_ORDER`. */
export interface GASRequestBodyAddData extends GASRequestBodyTypeBase {
    data: {
        sheetData: SheetIdName;
        addData: AddRecordData | AddRecordDataArray;
    };
}

/** The `data` part when doing `oprationConf.EDIT_ORDER`. */
export interface GASRequestBodyEditData extends GASRequestBodyTypeBase {
    data: {
        sheetData: SheetIdName;
        editData: EditRecordData;
    };
}

/** The `data` part when doing `oprationConf.EDIT_ORDER_BY_FINDER`. */
export interface GASRequestBodyEditByFinderData extends GASRequestBodyTypeBase {
    data: {
        sheetData: SheetIdName;
        editDataByFinder: EditByFinderRecordData;
    };
}

/** The `data` part when doing `oprationConf.ADD_SHEET_NAME`. */
export interface GASRequestBodyAddSheetName extends GASRequestBodyTypeBase {
    data: {
        sheetData: SheetIdName;
        addSheetName: string;
    };
}

/** The `data` part when doing `oprationConf.GET_SHEETS_NAME`. */
export interface GASRequestBodyGetSheetsName extends GASRequestBodyTypeBase { }

/** Data when doing `oprationConf.GET_ORDER`. */
interface RecordGet {
    col: number;
    finder: cell;
}
/** The `data` part when doing `oprationConf.GET_ORDER`. */
export interface GASRequestBodyGetData extends GASRequestBodyTypeBase {
    data: {
        sheetData: SheetIdName;
        getData: RecordGet;
    };
}

/** The `data` part when doing `oprationConf.GET_SHEET_DATA`. */
export interface GASRequestBodyGetSheetData extends GASRequestBodyTypeBase { }

/** The name of the sheet to be initialized. */
export interface GetInitSheetDataSheetNames {
    itemList: string;
    itemGroup: string;
    property: string;
}
/** It is just like the name. */
export type KeyOfGetInitSheetDataSheetNames = keyof GetInitSheetDataSheetNames;

/** Stores entries on the property sheet. */
export interface PropertyCol {
    mailAddress: number;
    orderNumber: number;
    name: number;
    bought: number;
    studentNumber: number;
    timestamp: number;
}

export namespace DefinedType {
    /** Item group type. */
    export const ItemGroupType = { ByName: "名前", ByQuantity: "個数" } as const;
}
/** It is just like the name. */
export type KeyOfItemGroupType = keyof typeof DefinedType.ItemGroupType;
