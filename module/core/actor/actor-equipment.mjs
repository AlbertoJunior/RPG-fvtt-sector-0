import { getObject } from "../../../scripts/utils/utils.mjs";
import { EquipmentUpdater } from "../../base/updater/equipment-updater.mjs";
import { SYSTEM_ID } from "../../constants.mjs";
import { EquipmentCharacteristicType, EquipmentType, equipmentTypeIdToTypeString, validEquipmentTypes } from "../../enums/equipment-enums.mjs";

export class ActorEquipmentUtils {
    static #allowedTypes = validEquipmentTypes().map(equipmentTypeIdToTypeString).filter(Boolean);

    static getEquipments(actor) {
        const object = Object.fromEntries(
            Object.entries(actor.itemTypes).filter(([type]) => this.#allowedTypes.includes(type))
        )

        const allItems = [];
        for (const items of Object.values(object)) {
            allItems.push(...items);
        }
        return allItems.sort((a, b) => a.sort - b.sort);
    }

    static getFilteredEquipment(actor, equipmentTypeId) {
        const items = this.getEquipments(actor);
        if (!equipmentTypeId) {
            return [...items];
        }

        const itemTypeString = equipmentTypeIdToTypeString(equipmentTypeId);
        return [...actor.itemTypes[itemTypeString]];
    }

    static getFilteredUnequippedEquipment(actor, equipmentTypeId) {
        const equipments = this.getFilteredEquipment(actor, equipmentTypeId);
        return [...equipments.filter(item => !getObject(item, EquipmentCharacteristicType.EQUIPPED))];
    }

    static getEquipmentById(actor, equipmentId) {
        return actor.items.get(equipmentId);
    }

    static getEquippedItems(actor) {
        const items = this.getEquipments(actor);
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

    static getEquippedArmorItem(actor) {
        const equipments = this.getEquippedItems(actor);
        const item = equipments.find(item => getObject(item, EquipmentCharacteristicType.TYPE) == EquipmentType.ARMOR);
        return item;
    }

    static getArmorEquippedValues(actor) {
        const equippedArmor = ActorEquipmentUtils.getEquippedArmorItem(actor);
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

    static getArmorEquippedResistence(actor) {
        const equippedArmor = this.getEquippedArmorItem(actor);
        return getObject(equippedArmor, EquipmentCharacteristicType.RESISTANCE) || 0;
    }

    static getArmorEquippedActualResistence(actor) {
        const equippedArmor = this.getEquippedArmorItem(actor);
        return getObject(equippedArmor, EquipmentCharacteristicType.ACTUAL_RESISTANCE) || 0;
    }

    static async equip(actor, equipment) {
        await EquipmentUpdater.updateEquipment(equipment, EquipmentCharacteristicType.EQUIPPED, true);
    }

    static async unequip(actor, equipment) {
        await EquipmentUpdater.updateEquipment(equipment, EquipmentCharacteristicType.EQUIPPED, false);
    }

    static async updateArmorEquippedActualResistance(actor, value) {
        const armor = this.getEquippedArmorItem(actor);
        if (!armor) {
            return;
        }
        const safedValue = Math.min(getObject(armor, EquipmentCharacteristicType.RESISTANCE), value);
        await EquipmentUpdater.updateEquipment(armor, EquipmentCharacteristicType.ACTUAL_RESISTANCE, safedValue);
    }

    static getItemAndRollTest(actor, equipmentId) {
        if(!actor || !equipmentId) {
            return null
        }

        const item = ActorEquipmentUtils.getEquipmentById(actor, equipmentId);
        if (!item) {
            return null;
        }

        const defaultTestId = getObject(item, EquipmentCharacteristicType.DEFAULT_TEST);
        if (!defaultTestId) {
            return null;
        }

        const possibleTests = getObject(item, EquipmentCharacteristicType.POSSIBLE_TESTS) || [];
        const rollTest = possibleTests.find(test => test.id == defaultTestId) || null;

        return {
            item,
            rollTest
        };
    }
}