import { getObject } from "../../../scripts/utils/utils.mjs";
import { EquipmentCharacteristicType } from "../../enums/equipment-enums.mjs";

export class EquipmentUtils {
    static getSuperEquipmentEffectsLimits(item) {
        const level = getObject(item, EquipmentCharacteristicType.SUPER_EQUIPMENT.LEVEL) || 0;
        const effects = getObject(item, EquipmentCharacteristicType.SUPER_EQUIPMENT.EFFECTS) || [];
        const defects = getObject(item, EquipmentCharacteristicType.SUPER_EQUIPMENT.DEFECTS) || [];

        const totalEffects = effects.reduce((sum, eff) => sum + (eff.cost || 0), 0);
        const totalDefects = defects.reduce((sum, def) => sum + (def.cost || 0), 0);
        const totalBonus = (level || 1) + totalDefects;

        return `${totalEffects}/${totalBonus}`;
    }

    static getSuperEquipmentLevel(item) {
        const level = getObject(item, EquipmentCharacteristicType.SUPER_EQUIPMENT.LEVEL) || 0;
        return level;
    }

    static getSuperEquipmentDefectsLimits(item) {
        const level = getObject(item, EquipmentCharacteristicType.SUPER_EQUIPMENT.LEVEL) || 0;
        const defects = getObject(item, EquipmentCharacteristicType.SUPER_EQUIPMENT.DEFECTS) || [];
        return `${defects.length}/${Math.max(level - 2, 0)}`;
    }

    static getSuperEquipmentHaveEffects(superEquipment) {
        if (!superEquipment) {
            return false;
        }

        const effects = superEquipment.effects || [];
        const defects = superEquipment.defects || [];
        const totalEffects = effects.length + defects.length;
        return totalEffects > 0;
    }
}