import { getObject, localize } from "../../../scripts/utils/utils.mjs";
import { activeEffectOriginTypeLabel, ActiveEffectsFlags, ActiveEffectsOriginTypes } from "../../enums/active-effects-enums.mjs";
import { EquipmentCharacteristicType, SubstanceType } from "../../enums/equipment-enums.mjs";
import { ActiveEffectsUtils } from "../effect/active-effects.mjs";

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

    static isSuperEquipment(item) {
        return Boolean(getObject(item, EquipmentCharacteristicType.SUPER_EQUIPMENT));
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

    static substanceEffects(item) {
        return getObject(item, EquipmentCharacteristicType.SUBSTANCE.EFFECTS) || [];
    }

    static substanceWithEffects(item) {
        const substanceType = getObject(item, EquipmentCharacteristicType.SUBSTANCE.TYPE);
        if (substanceType == null || substanceType == undefined) {
            return false;
        }
        return substanceType == SubstanceType.DRUG;
    }

    static getSubstanceActiveEffects(item) {
        const effects = getObject(item, EquipmentCharacteristicType.SUBSTANCE.EFFECTS) || [];
        const originLabel = localize('Substancia');
        const itemId = item.id;
        const allEffects = [];

        for (const effect of effects) {
            const activeEffect = ActiveEffectsUtils.createEffectData({
                id: `${itemId}.${effect.id}`,
                origin: originLabel,
                name: `${item.name}: ${effect.description}`,
                description: effect.description,
                statuses: [`${itemId}`],
                duration: { startRound: 0, rounds: 99 },
                changes: [
                    {
                        key: effect.change.key,
                        value: effect.change.value,
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    },
                ],
                flags: {
                    [ActiveEffectsFlags.ORIGIN_ID]: itemId,
                    [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.ITEM,
                    [ActiveEffectsFlags.ORIGIN_TYPE_LABEL]: activeEffectOriginTypeLabel(ActiveEffectsOriginTypes.ITEM),
                    [ActiveEffectsFlags.TYPE]: effect.type,
                }
            });

            allEffects.push(activeEffect);
        }
        return allEffects;
    }
}