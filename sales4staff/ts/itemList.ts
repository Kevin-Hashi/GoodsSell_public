import { ItemData, ItemDataBase, ItemDataGroup, ItemDataMap, ItemGroup, ItemGroupMap } from './type';
/**
 * Manage item data.
 *
 * @example const itemList = new ItemList();
 */
export class ItemList {
    /** The map consists of item groups and their keys. */
    protected readonly itemGroupMap: ItemGroupMap = new ItemGroupMap();
    /** This map consists of item groups and items. */
    protected readonly itemDataGroup: ItemDataGroup = new ItemDataGroup();

    /**
     * ForEach of `this.itemGroupMap`.
     *
     * @example itemList.forEachItemGroupMap((value, index, map) => { ... });
     */
    forEachItemGroupMap = this.itemGroupMap.forEach.bind(this.itemGroupMap);
    /**
     * ForEach of `this.itemDataGroup`.
     *
     * @example itemList.forEachItemDataGroup((value, index, map) => { ... });
     */
    forEachItemDataGroup = this.itemDataGroup.forEach.bind(this.itemDataGroup);

    /**
     * Add a group to the item group map.
     * This is used in {@link SellSystem.SellSystem.getInitData | SellSystem.getInitData()}.
     *
     * @example itemList.addItemGroup(itemGroup);
     */
    addItemGroup(itemGroup: ItemGroup): void {
        this.itemGroupMap.set(itemGroup.name, itemGroup);
    }

    /**
     * Add items to the item map.
     * This is used in {@link SellSystem.SellSystem.getInitData | SellSystem.getInitData()}.
     * The `itemGroup` to which it belongs need not exist in the `itemDataGroup`. It will be added automatically.
     *
     * @example itemList.addItem(itemData);
     */
    addItem(itemData: ItemData): void | never {
        const itemGroup = this.getItemGroup(itemData.itemGroupName);
        if (!itemGroup) throw Error(`itemGroup ${itemData.itemGroupName} not found`);

        const itemDataGroup = this.getItemDataMap(itemGroup);
        if (!itemDataGroup) {
            this.initItemDataMap(itemGroup);
            return this.addItem(itemData);
        }
        itemDataGroup.set(ItemList.createItemDataId(itemData), itemData);
    }

    /**
     * Get a group from the name of an item group.
     * This is used in {@link ItemList.addItem | ItemList.addItem()}.
     *
     * @example itemList.getItemGroup(itemGroupName); // returns itemGroup | undefined
     */
    getItemGroup(itemGroupName: string): ItemGroup | undefined {
        return this.itemGroupMap.get(itemGroupName);
    }

    /**
     * Get a map of the item from the item group.
     * This is used in {@link ItemList.addItem | ItemList.addItem()}, {@link SellSystem.SellSystem.parseOrder | SellSystem.parseOrder()}.
     *
     * @example itemList.getItemDataMap(itemGroup); // returns itemDataMap | undefined
     */
    getItemDataMap(itemGroup: ItemGroup): ItemDataMap | undefined {
        return this.itemDataGroup.get(itemGroup);
    }

    /** Add an empty map to `itemDataMap` with groups as keys. */
    protected initItemDataMap(itemGroup: ItemGroup): void {
        this.itemDataGroup.set(itemGroup, new ItemDataMap());
    }

    /**
     * Create a key for the item.
     * Used to pull items from an item group.
     *
     * @example itemList.createItemDataId({ name: 'itemName', itemGroupName: 'itemGroupName', size: 'XL' });
     * // returns 'itemGroupNameitemNameXL'
     * itemList.createItemDataId({ name: 'itemName', itemGroupName: 'itemGroupName', size: '' });
     * // returns 'itemGroupNameitemName'
     */
    static createItemDataId(itemData: ItemDataBase): string {
        return itemData.itemGroupName + itemData.name + itemData.size;
    }
}
