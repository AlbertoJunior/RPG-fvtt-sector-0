import { CoreRollMethods } from "../../core/rolls/core-roll-methods.mjs";
import { keyJsonToKeyLang, localize, toTitleCase } from "../../../scripts/utils/utils.mjs";

export class RollMessageCreator {
    static async mountContent(params) {
        const { messageTest, rolls, abilityInfo, modifiers, difficulty, critic, half, havePerseverance } = params;

        const { attr1, attr2 } = params.attrs;
        const formule = `(${attr1.value} + ${attr2.value}) / 2 + ${abilityInfo.value}`;

        const diceResults = this.#getDiceResults(rolls);

        const automatic = this.#getAutomaticFromModifiers(modifiers);
        const result = this.#verifyResultRoll(
            diceResults.overload, diceResults.default, abilityInfo.specialist, difficulty, critic, automatic
        );

        const updatedModifiers = {
            ...modifiers,
            specialist: abilityInfo.specialist
        }
        const coreContentData = this.mountCoreInformationRoll(diceResults, result, difficulty, critic, half, updatedModifiers, havePerseverance, formule);

        const data = {
            haveMessageTest: typeof messageTest === "string" && messageTest.trim().length > 0,
            messageTest: messageTest,
            attr1: keyJsonToKeyLang(attr1.label),
            attr2: keyJsonToKeyLang(attr2.label),
            ability: toTitleCase(abilityInfo.label.replaceAll('_', ' ')),
            ...coreContentData,
        };

        return await renderTemplate("systems/setor0OSubmundo/templates/messages/roll.hbs", data);
    }

    static async mountContentCustomRoll(params) {
        const { rolls, messageTest, modifiers, difficulty, critic, half, havePerseverance } = params;

        const diceResults = this.#getDiceResults(rolls);

        const { attr1, attr2, attr3 } = params.attrs;
        const formule = `(${attr1.value} + ${attr2.value}) ${attr3.value ? `/ 2 + ${attr3.value}` : ''}`.trim();

        const automatic = this.#getAutomaticFromModifiers(modifiers);
        const result = this.#verifyResultRoll(
            diceResults.overload, diceResults.default, modifiers.specialist, difficulty, critic, automatic
        );

        const formatedMessageTest = messageTest.split(":");

        const coreContentData = this.mountCoreInformationRoll(diceResults, result, difficulty, critic, half, modifiers, havePerseverance, formule);

        const data = {
            messageTestTitle: formatedMessageTest[0],
            messageTestSubtitle: formatedMessageTest[1],
            attr1: attr1.label,
            attr2: attr2.label,
            attr3: attr3.label,
            ...coreContentData
        };

        return await renderTemplate("systems/setor0OSubmundo/templates/messages/custom-roll.hbs", data);
    }

    static async mountContentSimplifiedRoll(params) {
        const { rolls, modifiers, difficulty, critic, half, havePerseverance } = params;

        const diceResults = this.#getDiceResults(rolls);

        const result = this.#verifyResultRoll(
            diceResults.overload, diceResults.default, modifiers.specialist, difficulty, critic, modifiers.automatic
        );

        debugger
        const formule = (diceResults.overload?.length || 0) + (diceResults.default?.length || 0)

        const coreContentData = this.mountCoreInformationRoll(diceResults, result, difficulty, critic, half, modifiers, havePerseverance, formule);

        const data = {
            testName: params.abilityInfo.label,
            haveResult: result.result > 0,
            ...coreContentData,
        };

        return await renderTemplate("systems/setor0OSubmundo/templates/messages/simplified-roll.hbs", data);
    }

    static #verifyResultRoll(dicesOverload = [], dicesDefault = [], specialist = false, difficulty = 6, critic = 10, automatic = 0) {
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

    static #getDiceResults(paramRolls) {
        return {
            overload: paramRolls.overload.values,
            default: paramRolls.default.values
        };
    }

    static #getAutomaticFromModifiers(modifiers) {
        let automatic = 0;
        if (modifiers) {
            automatic += modifiers.automatic || 0;
            automatic += modifiers.weapon?.true_damage || 0;
        }
        return automatic;
    }

    static mountCoreInformationRoll(diceResults, result, difficulty, critic, half, modifiers, havePerseverance, formule) {
        const overloadDices = (diceResults.overload || []).flat();
        const defaultDices = (diceResults.default || []).flat();
        const haveResult = (overloadDices.length + defaultDices.length) > 0;

        const safeDifficulty = difficulty || 6;
        const safeCritic = critic || 10;
        const safeHalf = (half == true) || false;

        const canUsePerseverance = diceResults.default.length > 0 && (havePerseverance || false);

        return {
            formule: formule,

            haveResult: haveResult,
            overloadValues: overloadDices,
            defaultValues: defaultDices,

            resultMessageClasses: result.message.classes,
            resultMessage: result.message.message,
            resultValue: result.result,

            canUsePerseverance: canUsePerseverance,

            difficulty: safeDifficulty,
            critic: safeCritic,
            half: safeHalf,

            specialist: modifiers.specialist || false,
            penalty: modifiers.penalty || 0,
            bonus: modifiers.bonus || 0,
            automatic: modifiers.automatic || 0,
            weapon: modifiers.weapon,
        }
    }
}
