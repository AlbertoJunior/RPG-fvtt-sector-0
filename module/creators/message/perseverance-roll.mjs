import { localize } from "../../../scripts/utils/utils.mjs";
import { TEMPLATES_PATH } from "../../constants.mjs";
import { CoreRollMethods } from "../../core/rolls/core-roll-methods.mjs";

export class RollPerseveranceMessageCreator {
    static async mountContent(params) {
        const { values, removedValues, specialist, difficulty, critic, automatic } = params;
        const successes = CoreRollMethods.calculateSuccess([], values, specialist, difficulty, critic, automatic).result;

        let resultMessage;
        let resultMessageClasses;
        if (successes > 0) {
            resultMessage = localize('Sucesso');
            resultMessageClasses = `S0-success`;
        } else if (successes < 0) {
            resultMessage = localize('Falha_Critica');
            resultMessageClasses = `S0-critical-failure`;
        } else {
            resultMessage = localize('Falha');
            resultMessageClasses = `S0-failure`;
        }

        const data = {
            diceValues: values,
            resultMessage: resultMessage,
            resultMessageClasses: resultMessageClasses,
            removedDiceValues: removedValues,
            resultValue: successes
        };

        return await renderTemplate(`${TEMPLATES_PATH}/messages/roll/perseverance.hbs`, data);
    }
}