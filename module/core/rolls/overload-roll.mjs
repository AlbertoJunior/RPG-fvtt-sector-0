import { getObject } from "../../../scripts/utils/utils.mjs";
import { CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { CoreRollMethods } from "./core-roll-methods.mjs";

export class RollOverload {
    static async roll(actor, amountOverloadTest = 1) {
        const core = getObject(actor, CharacteristicType.CORE.system);
        const resultRoll = await CoreRollMethods.rollDice(core);
        const success = this.calculateSuccess(resultRoll.values);
        return {
            roll: resultRoll.roll,
            values: resultRoll.values,
            success: success,
            missed: Math.max(amountOverloadTest - success, 0)
        }
    }

    static calculateSuccess(values) {
        
    }
}