import { ActorUtils } from "../../module/core/actor/actor-utils.mjs";
import { ActorCombatUtils } from "../../module/core/actor/actor-combat-utils.mjs";
import { BaseActorCharacteristicType, CharacteristicType, NpcSkillsMap } from "../../module/enums/characteristic-enums.mjs";
import { getObject } from "../utils/utils.mjs";
import { ActorEquipmentUtils } from "../../module/core/actor/actor-equipment.mjs";
import { NpcConversor } from "../../module/core/npc/npc-conversor.mjs";

const map = {
    'penalty': (actor) => ActorUtils.calculatePenalty(actor),
    'pm': (actor) => ActorUtils.calculateMovimentPoints(actor),
    'initiative': (actor) => ActorUtils.calculateInitiative(actor),
    'current_damage': (actor) => ActorUtils.getDamage(actor),
    'vitality': (actor) => getObject(actor, BaseActorCharacteristicType.VITALITY.TOTAL),
    'actual_languages': (actor) => ActorUtils.getActualLanguages(actor).length,
    'total_languages': (actor) => ActorUtils.calculateTotalLanguages(actor),
    'total_experience': (actor) => ActorUtils.calculateTotalExperience(actor),

    'have_equipped_armor': (actor) => Boolean(ActorEquipmentUtils.getEquippedArmorItem(actor)),
    'equipped_amor_total_resistance': (actor) => ActorEquipmentUtils.getArmorEquippedResistence(actor),
    'equipped_amor_actual_resistance': (actor) => ActorEquipmentUtils.getArmorEquippedActualResistence(actor),

    'actual_consciousness': (actor) => ActorUtils.calculateActualVirtue(actor, CharacteristicType.VIRTUES.CONSCIOUSNESS),
    'actual_perseverance': (actor) => ActorUtils.calculateActualVirtue(actor, CharacteristicType.VIRTUES.PERSEVERANCE),
    'actual_quietness': (actor) => ActorUtils.calculateActualVirtue(actor, CharacteristicType.VIRTUES.QUIETNESS),

    'effects': (actor) => ActorUtils.getEffectsSorted(actor),

    'offensive_projectile': (actor) => ActorCombatUtils.calculateOffensiveProjectileDices(actor),
    'offensive_projectile_half': (actor) => Math.floor(ActorCombatUtils.calculateOffensiveProjectileDices(actor) / 2),
    'offensive_brawl': (actor) => ActorCombatUtils.calculateOffensiveBrawlDices(actor),
    'offensive_brawl_half': (actor) => Math.floor(ActorCombatUtils.calculateOffensiveBrawlDices(actor) / 2),
    'offensive_melee': (actor) => ActorCombatUtils.calculateOffensiveMeleeDices(actor),
    'offensive_melee_half': (actor) => Math.floor(ActorCombatUtils.calculateOffensiveMeleeDices(actor) / 2),

    'defensive_dodge': (actor) => ActorCombatUtils.calculateDefensiveDodgeDices(actor),
    'defensive_dodge_half': (actor) => ActorCombatUtils.calculateDefensiveHalfDodgeDices(actor),
    'defensive_block_melee': (actor) => ActorCombatUtils.calculateDefensiveBlockMeleeDices(actor),
    'defensive_block_melee_half': (actor) => ActorCombatUtils.calculateDefensiveHalfBlockMeleeDices(actor),
    'defensive_block_brawl': (actor) => ActorCombatUtils.calculateDefensiveBlockBrawlDices(actor),
    'defensive_block_brawl_half': (actor) => ActorCombatUtils.calculateDefensiveHalfBlockBrawlDices(actor),

    'npc_actual_skill_name': (actor, skill = '') => { return getObject(actor, NpcSkillsMap[skill].SKILL_NAME) || '' },
    'npc_actual_skill_value': (actor, skill) => { return getObject(actor, NpcSkillsMap[skill].VALUE) || 0 },
    'npc_stamina': (actor) => NpcConversor.getStamina(actor),

    'calculate_dice_pool': (actor, params) => {
        const { primary_attribute, secondary_attribute, ability, bonus = 0 } = params[0];
        return ActorUtils.calculateDices(actor, primary_attribute, secondary_attribute, ability) + bonus;
    },
}

export default function actorValues(actor, value, ...params) {
    params.pop()
    return map[value](actor, params) || 0;
}