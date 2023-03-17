interface Post {
    status: StatusValues,
    errorcode?: ErrorValues,
    data?: { [key: string]: string | number | boolean | object | RecordData; },
}
interface SheetData {
    sheetId: string,
    sheetName?: string;
}
interface RecordData {
    /** ゼロオリジン */
    row?: number,
    data: Array<any>;
}
interface RecordDataArray {
    /** ゼロオリジン */
    row?: number,
    data: Array<Array<any>>;
}
interface RecordGet {
    /** ゼロオリジン */
    col: number,
    finder: any;
}
type RecordEdit = {
    data: any;
    row: number;
    col: number;
}[];
interface RecordEditByFinder extends RecordGet {
    editCol: number,
    value: string | number | boolean;
}

type OprationData = typeof oprationConf[keyof typeof oprationConf];
interface SheetPostData {
    sheetData: SheetData,
    oprationData: OprationData,
    addData?: RecordData | RecordDataArray,
    getData?: RecordGet,
    editData?: RecordData;
}
