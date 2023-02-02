type SheetData = (string | number | boolean)[];

interface ItemCol {
    itemCol: number;
}

interface ItemColWithSize extends ItemCol {
    sizeCol: number;
}

type ItemColList = (ItemCol | ItemColWithSize)[];

interface ItemGroup {
    name: string;
    itemColList: ItemColList;
}

type ItemDataId = string | number;

interface ItemDataBase {
    name: string;
    itemGroup: string;
    size: string;
}
interface ItemData extends ItemDataBase{
    price: number;
}

type ItemDataMap = Map<ItemDataId, ItemData>;
type ItemDataGroup = Map<ItemGroup, ItemDataMap>;

type NumOfItems = Map<ItemData, number>;
