import { SYSTEM_ID } from "../constants.mjs";
import { equipmentParseData } from "../data/equipment-data-model.mjs";
import { validEquipmentTypes } from "../enums/equipment-enums.mjs";

export class EquipmentRepository {

    static #loadedFromPack = [];
    static #loadedFromGame = [];

    static async _loadFromGame() {
        const validTypes = validEquipmentTypes();
        EquipmentRepository.#loadedFromPack = await game.items?.filter(item => validTypes.includes(item.system.type));
    }

    static async _loadFromPack() {
        const compendium = await game.packs.get(`${SYSTEM_ID}.itens`)?.getDocuments();
        if (compendium) {
            EquipmentRepository.#loadedFromPack = compendium.map((equipment) => {
                return equipmentParseData(equipment);
            });
        }
    }

    static addItem(item) {
        if (!this.#loadedFromGame.includes(item)) {
            this.#loadedFromGame.push(item);
        }
    }

    static getItems() {
        return [... this.#loadedFromPack, ... this.#loadedFromGame];
    }

    static getItemById(items, itemId) {
        return items.find(item => item.id == itemId);
    }
}