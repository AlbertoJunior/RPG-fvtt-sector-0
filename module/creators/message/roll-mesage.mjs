import { CoreRollMethods } from "../../core/rolls/core-roll-methods.mjs";
import { keyJsonToKeyLang, localize, toTitleCase } from "../../../scripts/utils/utils.mjs";

export class RollMessageCreator {
    static async mountContent(params) {
        const { messageTest, rolls, attrs, abilityInfo, modifiers, difficulty, critic, havePerseverance } = params;

        const diceResults = {
            overload: rolls.overload.values,
            default: rolls.default.values
        };

        const attr1 = attrs.attr1;
        const attr2 = attrs.attr2;

        let automatic = 0;
        if (modifiers) {
            automatic += modifiers.automatic || 0;
            automatic += modifiers.weapon?.true_damage || 0;
        }

        const result = this.#verifyResultRoll(
            diceResults.overload, diceResults.default, abilityInfo.specialist, difficulty, critic, automatic
        );

        const canUsePerseverance = diceResults.default.length > 0 && (havePerseverance || false);

        const data = {
            haveMessageTest: typeof messageTest === "string" && messageTest.trim().length > 0,
            messageTest: messageTest,
            haveResult: (rolls.overload.values.length + rolls.default.values.length) > 0,
            attr1: keyJsonToKeyLang(attr1.label),
            attr2: keyJsonToKeyLang(attr2.label),
            ability: toTitleCase(abilityInfo.label.replaceAll('_', ' ')),
            formule: `(${attr1.value} + ${attr2.value}) / 2 + ${abilityInfo.value}`,
            overloadValues: diceResults.overload.flat(),
            defaultValues: diceResults.default.flat(),
            canUsePerseverance: canUsePerseverance,
            resultMessageClasses: result.message.classes,
            resultMessage: result.message.message,
            resultValue: result.result,
            difficulty: difficulty,
            critic: critic,
            penalty: modifiers.penalty,
            bonus: modifiers.bonus,
            automatic: modifiers.automatic,
            weapon: modifiers.weapon,
        };

        return await renderTemplate("systems/setor0OSubmundo/templates/messages/roll.hbs", data);
    }

    static async mountContentCustomRoll(params) {
        const { messageTest, modifiers, difficulty, critic, half, havePerseverance } = params;

        const diceResults = {
            overload: params.rolls.overload.values,
            default: params.rolls.default.values
        };

        const { attr1, attr2, attr3 } = params.attrs;
        const formule = `(${attr1.value} + ${attr2.value}) ${attr3.value ? `/ 2 + ${attr3.value}` : ''}`.trim();

        let automatic = 0;
        if (modifiers) {
            automatic += modifiers.automatic || 0;
            automatic += modifiers.weapon?.true_damage || 0;
        }

        const result = this.#verifyResultRoll(
            diceResults.overload, diceResults.default, modifiers.specialist, difficulty, critic, automatic
        );

        const canUsePerseverance = diceResults.default.length > 0 && (havePerseverance || false);

        const formatedMessageTest = messageTest.split(":");

        const data = {
            messageTestTitle: formatedMessageTest[0],
            messageTestSubtitle: formatedMessageTest[1],
            haveResult: (diceResults.overload.length + diceResults.default.length) > 0,
            attr1: attr1.label,
            attr2: attr2.label,
            attr3: attr3.label,
            formule: formule,
            overloadValues: diceResults.overload.flat(),
            defaultValues: diceResults.default.flat(),
            canUsePerseverance: canUsePerseverance,
            resultMessageClasses: result.message.classes,
            resultMessage: result.message.message,
            resultValue: result.result,
            difficulty: difficulty,
            critic: critic,
            half: half,
            specialist: modifiers.specialist,
            penalty: modifiers.penalty,
            bonus: modifiers.bonus,
            automatic: modifiers.automatic,
            weapon: modifiers.weapon,
        };

        return await renderTemplate("systems/setor0OSubmundo/templates/messages/custom-roll.hbs", data);
    }

    static #verifyResultRoll(dicesOverload, dicesDefault, specialist, difficulty, critic, automatic = 0) {
        const { result, overload } = CoreRollMethods.calculateSuccess(dicesOverload, dicesDefault, specialist, difficulty, critic, automatic);
        const message = this.#mountResultMessageInfos(result, overload);
        return { result, message };
    }

    static #mountResultMessageInfos(resultSuccess, haveOverload) {
        let messageInfo = '';
        if (resultSuccess > 0) {
            messageInfo = {
                message: haveOverload ? `${localize('Sucesso_Explosivo').toUpperCase()}!` : localize('Sucesso'),
                classes: haveOverload ? "S0-overload S0-success" : "S0-success"
            }
        } else if (resultSuccess < 0) {
            messageInfo = {
                message: haveOverload ? localize('Falha_Caotica').toUpperCase() : localize('Falha_Critica'),
                classes: haveOverload ? "S0-overload S0-critical-failure" : "S0-critical-failure"
            }
        } else {
            messageInfo = {
                message: localize('Falha'),
                classes: "S0-failure"
            }
        }

        return messageInfo;
    }
}
