//@ts-check
///<reference path="type.ts"/>
class ItemList {
    /** @type {Map<string, ItemGroup>} */
    #itemGroup = new Map();
    /** @type {ItemDataGroup} */
    #itemDataGroup = new Map();
    get itemGroup() { return this.#itemGroup; }
    get itemDataGroup() { return this.#itemDataGroup; }
    /**
     * @param {ItemGroup} itemGroup
     */
    addItemGroup(itemGroup) {
        this.#itemGroup.set(itemGroup.name, itemGroup);
    }
    /**
     * @param {ItemData} itemData
     */
    addItem(itemData) {
        const itemGroup = this.#itemGroup.get(itemData.itemGroup);
        if (!itemGroup) throw TypeError();
        const itemDataGroup = this.#itemDataGroup.get(itemGroup);
        if (!itemDataGroup) {
            this.#itemDataGroup.set(itemGroup, new Map());
            return this.addItem(itemData);
        };
        itemDataGroup.set(createItemDataId(itemData), itemData);
    }
}
/**
 * @param {ItemDataBase} itemData
 * @returns {string}
 */
function createItemDataId(itemData) {
    return itemData.itemGroup + itemData.name + itemData.size;
}
