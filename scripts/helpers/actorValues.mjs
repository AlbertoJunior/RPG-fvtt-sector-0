import { CharacteristicType } from "../../module/enums/characteristic-enums.mjs";
import { ActorUtils } from "../../module/utils/actor-utils.mjs";
import { getObject } from "../utils/utils.mjs";

const map = {
    'penalty': (actor) => ActorUtils.calculatePenalty(actor),
    'pm': (actor) => ActorUtils.calculateMovimentPoints(actor),
    'initiative': (actor) => ActorUtils.calculateInitiative(actor),
    'current_damage': (actor) => ActorUtils.getDamage(actor),
    'vitality': (actor) => getObject(actor, CharacteristicType.VITALITY.TOTAL),
    'actual_languages': (actor) => ActorUtils.getActualLanguages(actor).length,
    'total_languages': (actor) => ActorUtils.calculateTotalLanguages(actor),
}

export default function actorValues(actor, value) {
    return map[value](actor) || 0;
}