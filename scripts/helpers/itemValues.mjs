import { EquipmentUtils } from "../../module/core/equipment/equipment-utils.mjs";

const map = {
    'superequipment_level': (item) => EquipmentUtils.getSuperEquipmentLevel(item),
    'superequipment_effects_limit': (item) => EquipmentUtils.getSuperEquipmentEffectsLimits(item),
    'superequipment_defects_limit': (item) => EquipmentUtils.getSuperEquipmentDefectsLimits(item),
    'superequipment_needs_activate': (item) => EquipmentUtils.getSuperEquipmentNeedsActivate(item),
    'substance_effects': (item) => EquipmentUtils.substanceEffects(item),
    'substance_with_effects': (item) => EquipmentUtils.substanceWithEffects(item),
}

export default function itemValues(item, value, ...params) {
    params.pop()
    return map[value](item, params) || 0;
}