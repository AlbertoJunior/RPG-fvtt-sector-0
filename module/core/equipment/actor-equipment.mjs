import { SYSTEM_ID } from "../../constants.mjs";
import { equipmentTypeIdToTypeString, validEquipmentTypes } from "../../enums/equipment-enums.mjs";

export class ActorEquipmentUtils {
    static #allowedTypes = validEquipmentTypes().map(equipmentTypeIdToTypeString).filter(Boolean);

    static getActorEquipments(actor) {
        const object = Object.fromEntries(
            Object.entries(actor.itemTypes).filter(([type]) => this.#allowedTypes.includes(type))
        )

        const allItems = [];
        for (const items of Object.values(object)) {
            allItems.push(...items);
        }
        return allItems;
    }

    static getActorFilteredEquipment(actor, equipmentTypeId) {
        const items = this.getActorEquipments(actor);
        if (!equipmentTypeId) {
            return [...items];
        }

        const itemTypeString = equipmentTypeIdToTypeString(equipmentTypeId);
        return [...actor.itemTypes[itemTypeString]];
    }

    static getActorEquipmentById(actor, equipmentId) {
        return actor.items.get(equipmentId);
    }

    static getActorEquippedItems(actor) {
        const items = this.getActorEquipments(actor);
        return [...items.filter(actorItem => actorItem.flags[SYSTEM_ID].equipped)];
    }

    static createDataItem(equipment, params = {}) {
        if (!equipment) {
            return undefined;
        }

        const { flags = {}, effects = [] } = params;

        const itemData = foundry.utils.duplicate(equipment);

        return {
            name: itemData.name,
            img: itemData.img,
            flags: {
                [SYSTEM_ID]: {
                    sourceId: itemData._id,
                    ...flags
                }
            },
            effects: effects,
            type: itemData.type,
            system: itemData.system
        };
    }

}