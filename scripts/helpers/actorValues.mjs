import { ActorUtils } from "../utils/actor.mjs";

const map = {
    'penalty': (actor) => ActorUtils.calculatePenalty(actor),
    'pm': (actor) => ActorUtils.calculateMovimentPoints(actor),
    'initiative': (actor) => ActorUtils.calculateInitiative(actor),
}

export default function actorValues(actor, value) {
    return map[value](actor) || 0
}