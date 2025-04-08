import { ActorUtils } from "../../../scripts/utils/actor.mjs";
import { CoreRollMethods } from "./core-roll-methods.mjs";

export class RollAttribute {
    static async roll(actor, params) {
        const { attr1, attr2, ability, specialist } = params;

        const attrValue1 = ActorUtils.getAttributeValue(actor, attr1);
        const attrValue2 = ActorUtils.getAttributeValue(actor, attr2);
        const abilityValue = ActorUtils.getAbilityValue(actor, ability);
        const penalty = ActorUtils.calculatePenalty(actor);

        const diceAmount = this.#calculateDiceAmount(attrValue1, attrValue2, abilityValue, penalty);
        const overloadDiceAmount = Math.min(ActorUtils.getOverload(actor), diceAmount);

        const [rollOverloadResults, rollDefaultResults] = await Promise.all([
            CoreRollMethods.rollDice(overloadDiceAmount),
            CoreRollMethods.rollDice(Math.max(diceAmount - overloadDiceAmount, 0))
        ]);

        const rollsResults = {
            overload: rollOverloadResults,
            default: rollDefaultResults
        }

        const attributes = {
            attr1: {
                label: attr1,
                value: attrValue1
            },
            attr2: {
                label: attr2,
                value: attrValue2
            },
        }

        const abilityInformations = {
            label: ability,
            value: abilityValue,
            specialist: specialist
        };

        return {
            roll: rollsResults,
            attrs: attributes,
            abilityInfo: abilityInformations
        };
    }

    static #calculateDiceAmount(attribute1, attribute2, ability, penalty) {
        const amount = Math.floor((attribute1 + attribute2) / 2) + ability;
        const finalAmount = Math.max(amount - penalty, 0);
        return finalAmount;
    }
}