import { ActorUtils } from "../../../scripts/utils/actor.mjs";
import { CoreRollMethods } from "./core-roll-methods.mjs";

export class RollAttribute {
    static async roll(actor, params) {
        const { attr1, attr2, ability, specialist = false, bonus = 0, automatic = 0, weapon } = params;

        const attrValue1 = ActorUtils.getAttributeValue(actor, attr1);
        const attrValue2 = ActorUtils.getAttributeValue(actor, attr2);
        const abilityValue = ActorUtils.getAbilityValue(actor, ability);
        const penalty = ActorUtils.calculatePenalty(actor);

        const abilityBonusWeaponValue = abilityValue + bonus + (weapon?.damage || 0);

        const diceAmount = this.#calculateDiceAmount(attrValue1, attrValue2, abilityBonusWeaponValue, penalty);
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

        const modifiersInformations = {
            automatic: automatic,
            bonus: bonus,
            penalty: penalty,
            weapon: weapon
        }

        const abilityInformations = {
            label: ability,
            value: abilityValue,
            specialist: specialist
        };

        return {
            roll: rollsResults,
            attrs: attributes,
            abilityInfo: abilityInformations,
            modifiers: modifiersInformations
        };
    }

    static async rollByRollableTests(actor, rollable) {
        const params = this.#mountParamsByRollable(rollable);
        return this.roll(actor, params);
    }

    static async rollByRollableTestsWithWeapon(actor, rollable, weapon) {
        const params = {
            ...this.#mountParamsByRollable(rollable),
            weapon: {
                damage: weapon.system.damage,
                true_damage: weapon.system.true_damage
            }
        };
        return this.roll(actor, params);
    }

    static #calculateDiceAmount(attribute1, attribute2, ability, penalty) {
        const amount = Math.floor((attribute1 + attribute2) / 2) + ability;
        const finalAmount = Math.max(amount - penalty, 0);
        return finalAmount;
    }

    static #mountParamsByRollable(rollable) {
        return {
            attr1: rollable.primary_attribute,
            attr2: rollable.secondary_attribute,
            ability: rollable.ability,
            specialist: rollable.specialist,
            automatic: rollable.automatic,
            bonus: rollable.bonus,
        }
    }
}