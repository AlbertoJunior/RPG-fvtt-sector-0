import { ActorUtils } from "../../module/core/actor/actor-utils.mjs";
import { ActorCombatUtils } from "../../module/core/actor/actor-combat-utils.mjs";
import { CharacteristicType } from "../../module/enums/characteristic-enums.mjs";
import { getObject } from "../utils/utils.mjs";

const map = {
    'penalty': (actor) => ActorUtils.calculatePenalty(actor),
    'pm': (actor) => ActorUtils.calculateMovimentPoints(actor),
    'initiative': (actor) => ActorUtils.calculateInitiative(actor),
    'current_damage': (actor) => ActorUtils.getDamage(actor),
    'vitality': (actor) => getObject(actor, CharacteristicType.VITALITY.TOTAL),
    'actual_languages': (actor) => ActorUtils.getActualLanguages(actor).length,
    'total_languages': (actor) => ActorUtils.calculateTotalLanguages(actor),
    'total_experience': (actor) => ActorUtils.calculateTotalExperience(actor),

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

    'calculate_dice_pool': (actor, params) => {
        const { primary_attribute, secondary_attribute, ability, bonus = 0 } = params;
        return ActorUtils.calculateDices(actor, primary_attribute, secondary_attribute, ability) + bonus;
    },
}

export default function actorValues(actor, value, ...params) {        
    return map[value](actor, params[0]) || 0;
}