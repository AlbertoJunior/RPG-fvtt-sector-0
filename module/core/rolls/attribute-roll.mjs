import { getObject } from "../../../scripts/utils/utils.mjs";
import { EquipmentCharacteristicType } from "../../enums/equipment-enums.mjs";
import { ActorUtils } from "../../utils/actor-utils.mjs";
import { CoreRollMethods } from "./core-roll-methods.mjs";

export class RollAttribute {
    static async roll(actor, params) {
        const { attr1, attr2, ability, specialist = false, bonus = 0, automatic = 0, weapon } = params;

        const bonusWeaponValue = bonus + (weapon?.damage || 0);
        const penalty = ActorUtils.calculatePenalty(actor);
        const diceAmount = this.#calculateDiceAmount(actor, attr1, attr2, ability, penalty) + bonusWeaponValue;
        
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
                value: ActorUtils.getAttributeValue(actor, attr1)
            },
            attr2: {
                label: attr2,
                value: ActorUtils.getAttributeValue(actor, attr2)
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
            value: ActorUtils.getAbilityValue(actor, ability),
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
                damage: getObject(weapon, EquipmentCharacteristicType.DAMAGE),
                true_damage: getObject(weapon, EquipmentCharacteristicType.TRUE_DAMAGE)
            }
        };
        return this.roll(actor, params);
    }

    static #calculateDiceAmount(actor, attr1, attr2, ability, penalty) {
        const amount = ActorUtils.calculateDices(actor, attr1, attr2, ability);
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