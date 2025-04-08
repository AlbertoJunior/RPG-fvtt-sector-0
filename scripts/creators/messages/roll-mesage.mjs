import { CoreRollMethods } from "../../../module/core/rolls/core-roll-methods.mjs";
import { keyJsonToKeyLang, toTitleCase } from "../../utils/utils.mjs";

export class RollMessageCreator {
    static async mountContent(rolls, attrs, abilityInfo, difficulty) {
        const diceResults = {
            overload: rolls.overload.values,
            default: rolls.default.values
        };

        const attr1 = attrs.attr1;
        const attr2 = attrs.attr2;

        const result = this.#verifyResultRoll(
            diceResults.overload, diceResults.default, abilityInfo.specialist, difficulty
        );

        const data = {
            haveResult: (rolls.overload.values.length + rolls.default.values.length) > 0,
            attr1: keyJsonToKeyLang(attr1.label),
            attr2: keyJsonToKeyLang(attr2.label),
            ability: toTitleCase(abilityInfo.label.replaceAll('_', ' ')),
            formule: `(${attr1.value} + ${attr2.value}) / 2 + ${abilityInfo.value}`,
            overloadValues: diceResults.overload.flat(),
            defaultValues: diceResults.default.flat(),
            resultMessageClasses: result.message.classes,
            resultMessage: result.message.message,
            resultValue: result.result + result.overload
        };

        return await renderTemplate("systems/setor0OSubmundo/templates/messages/roll.hbs", data);
    }

    static #verifyResultRoll(dicesOverload, dicesDefault, specialist, difficulty) {
        const { result, overload } = CoreRollMethods.calculateSuccess(dicesOverload, dicesDefault, specialist, difficulty);
        const message = this.#mountResultMessageInfos(result, overload);
        return { result, overload, message };
    }

    static #mountResultMessageInfos(resultSuccess, haveOverload) {
        let messageInfo = ''
        if (resultSuccess > 0) {
            messageInfo = {
                message: haveOverload ? "SUCESSO EXPLOSIVO!" : "Sucesso",
                classes: haveOverload ? "S0-overload S0-success" : "S0-success"
            }
        } else if (resultSuccess < 0) {
            messageInfo = {
                message: haveOverload ? "FALHA CAÓTICA" : "Falha Crítica",
                classes: haveOverload ? "S0-overload S0-critical-failure" : "S0-critical-failure"
            }
        } else {
            messageInfo = {
                message: "Falha",
                classes: "S0-failure"
            }
        }

        return messageInfo;
    }
}
