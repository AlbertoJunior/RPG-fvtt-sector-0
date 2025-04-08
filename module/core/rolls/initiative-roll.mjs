import { ActorUtils } from "../../../scripts/utils/actor.mjs";
import { CoreRollMethods } from "./core-roll-methods.mjs";

export class RollInitiative {
    static async roll(actor) {
        const initiative = ActorUtils.calculateInitiative(actor);
        const resultRoll = await CoreRollMethods.rollDice(1);
        const value = resultRoll.values[0];
        return {
            initiative: initiative,
            value: value,
            total: initiative + value,
            roll: resultRoll.roll,
            values: resultRoll.values,
        }
    }
}