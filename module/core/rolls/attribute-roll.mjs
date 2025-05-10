import { getObject } from "../../../scripts/utils/utils.mjs";
import { EquipmentCharacteristicType } from "../../enums/equipment-enums.mjs";
import { ActorUtils } from "../actor/actor-utils.mjs";
import { CoreRollMethods } from "./core-roll-methods.mjs";

export class RollAttribute {
    static async roll(actor, params) {
        const {
            attr1, attr2, ability, specialist = false,
            bonus = 0, automatic = 0, weapon,
            isHalf = false
        } = params;

        const penalty = ActorUtils.calculatePenalty(actor);
        const diceAmount = ActorUtils.calculateDices(actor, attr1, attr2, ability);

        const diceAmountVerifiedHalf = isHalf ? Math.floor(diceAmount / 2) : diceAmount;
        const diceAmountPlusBonus = diceAmountVerifiedHalf + Number(bonus);
        const diceAmountSubtractedPenalty = Math.max(diceAmountPlusBonus - penalty, 0);

        let diceAmountWithWeapon = diceAmountSubtractedPenalty;
        if (diceAmountSubtractedPenalty > 0) {
            const weaponDamage = Number(weapon?.damage) || 0
            diceAmountWithWeapon += weaponDamage;
        }

        const rollsResults = await CoreRollMethods.rollDiceAmountWithOverload(actor, diceAmountWithWeapon);

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
            automatic: Number(automatic),
            bonus: Number(bonus),
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