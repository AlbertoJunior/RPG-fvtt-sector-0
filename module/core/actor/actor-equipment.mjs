import { getObject } from "../../../scripts/utils/utils.mjs";
import { EquipmentUpdater } from "../../base/updater/equipment-updater.mjs";
import { SYSTEM_ID } from "../../constants.mjs";
import { EquipmentCharacteristicType, EquipmentType, equipmentTypeIdToTypeString, validEquipmentTypes } from "../../enums/equipment-enums.mjs";

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
        return allItems.sort((a, b) => a.sort - b.sort);
    }

    static getActorFilteredEquipment(actor, equipmentTypeId) {
        const items = this.getActorEquipments(actor);
        if (!equipmentTypeId) {
            return [...items];
        }

        const itemTypeString = equipmentTypeIdToTypeString(equipmentTypeId);
        return [...actor.itemTypes[itemTypeString]];
    }

    static getActorFilteredUnequippedEquipment(actor, equipmentTypeId) {
        const equipments = this.getActorFilteredEquipment(actor, equipmentTypeId);
        return [...equipments.filter(item => !getObject(item, EquipmentCharacteristicType.EQUIPPED))];
    }

    static getActorEquipmentById(actor, equipmentId) {
        return actor.items.get(equipmentId);
    }

    static getActorEquippedItems(actor) {
        const items = this.getActorEquipments(actor);
        return [...items.filter(item => getObject(item, EquipmentCharacteristicType.EQUIPPED))];
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

    static getActorEquippedArmorItem(actor) {
        const equipments = this.getActorEquippedItems(actor);
        const item = equipments.find(item => getObject(item, EquipmentCharacteristicType.TYPE) == EquipmentType.ARMOR);
        return item;
    }

    static getActorArmorEquippedValues(actor) {
        const equippedArmor = ActorEquipmentUtils.getActorEquippedArmorItem(actor);
        if (Boolean(equippedArmor)) {
            return {
                max: getObject(equippedArmor, EquipmentCharacteristicType.RESISTANCE) || 0,
                value: getObject(equippedArmor, EquipmentCharacteristicType.ACTUAL_RESISTANCE) || 0,
            };
        } else {
            return {
                max: 0,
                value: 0,
            };
        }
    }

    static getActorArmorEquippedResistence(actor) {
        const equippedArmor = this.getActorEquippedArmorItem(actor);
        return getObject(equippedArmor, EquipmentCharacteristicType.RESISTANCE) || 0;
    }

    static getActorArmorEquippedActualResistence(actor) {
        const equippedArmor = this.getActorEquippedArmorItem(actor);
        return getObject(equippedArmor, EquipmentCharacteristicType.ACTUAL_RESISTANCE) || 0;
    }

    static async equip(actor, equipment) {
        await EquipmentUpdater.updateEquipment(equipment, EquipmentCharacteristicType.EQUIPPED, true);
    }

    static async unequip(actor, equipment) {
        await EquipmentUpdater.updateEquipment(equipment, EquipmentCharacteristicType.EQUIPPED, false);
    }
}