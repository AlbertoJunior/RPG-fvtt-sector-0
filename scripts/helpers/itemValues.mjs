import { ActiveEffectsUtils } from "../../module/core/effect/active-effects.mjs";
import { EquipmentUtils } from "../../module/core/equipment/equipment-utils.mjs";

const map = {
    'canRoll': (item) => EquipmentUtils.canRoll(item),
    'canEquip': (item) => EquipmentUtils.canEquip(item),
    'canUse': (item) => EquipmentUtils.canUse(item),
    'haveQuantity': (item) => EquipmentUtils.haveQuantity(item),
    'possible_tests': (item) => EquipmentUtils.getPossibleTests(item),
    'default_test': (item) => EquipmentUtils.getDefaultTest(item),
    'superequipment_level': (item) => EquipmentUtils.getSuperEquipmentLevel(item),
    'superequipment_effects_limit': (item) => EquipmentUtils.getSuperEquipmentEffectsLimits(item),
    'superequipment_defects_limit': (item) => EquipmentUtils.getSuperEquipmentDefectsLimits(item),
    'superequipment_needs_activate': (item) => EquipmentUtils.getSuperEquipmentNeedsActivate(item),
    'substance_effects': (item) => EquipmentUtils.substanceEffects(item),
    'substance_with_effects': (item) => EquipmentUtils.substanceWithEffects(item),
    'effect_has_type': (item) => ActiveEffectsUtils.hasType(item),
    'effect_is_buff': (item) => ActiveEffectsUtils.isBuff(item),
    'effect_is_debuff': (item) => ActiveEffectsUtils.isDebuff(item),
}

export default function itemValues(item, value, ...params) {
    params.pop()
    return map[value](item, params) || 0;
}