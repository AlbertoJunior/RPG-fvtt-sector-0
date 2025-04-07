import { RollMessageCreator } from "../creators/messages/roll-mesage.mjs";
import { ActorUtils } from "../utils/actor.mjs";

export async function rollAttribute(actor, params) {
    const { attr1, attr2, ability, specialist, difficulty } = params;

    const attrValue1 = ActorUtils.getAttributeValue(actor, attr1);
    const attrValue2 = ActorUtils.getAttributeValue(actor, attr2);
    const abilityValue = ActorUtils.getAbilityValue(actor, ability);
    const penalty = ActorUtils.calculatePenalty(actor);

    const diceAmount = calculateDiceAmount(attrValue1, attrValue2, abilityValue, penalty);
    const overloadDiceAmount = Math.min(ActorUtils.getOverload(actor), diceAmount);

    const [rollOverloadResults, rollDefaultResults] = await Promise.all([
        rollDice(overloadDiceAmount),
        rollDice(Math.max(diceAmount - overloadDiceAmount, 0))
    ]);

    const roll = {
        overload: rollOverloadResults,
        default: rollDefaultResults
    }

    const attrs = {
        attr1: {
            label: attr1,
            value: attrValue1
        },
        attr2: {
            label: attr2,
            value: attrValue2
        },
    }

    const abilityInfo = {
        label: ability,
        value: abilityValue,
        specialist: specialist
    };

    return {
        roll: roll,
        attrs: attrs,
        abilityInfo: abilityInfo
    };
}

function calculateDiceAmount(attribute1, attribute2, ability, penalty) {
    const amount = Math.floor((attribute1 + attribute2) / 2) + ability;
    const finalAmount = Math.max(amount - penalty, 0);
    return finalAmount;
}

async function rollDice(amount) {
    if (amount > 0) {
        const rollFormula = `${amount}d10`;
        const roll = new Roll(rollFormula);
        await roll.evaluate();

        return {
            roll: roll,
            values: roll.dice.map(dice => dice.results.map(result => result.result))
        };
    }

    return {
        roll: undefined,
        values: []
    };
};

export function calculateSuccess(dicesOverload, dicesDefault, specialist, difficulty) {
    let resultOverload = 0;
    let overload = false;
    if (dicesOverload.length > 0) {
        dicesOverload[0].forEach(element => {
            if (element == 10) {
                resultOverload += 3;
                overload = true;
            } else if (element == 1) {
                resultOverload -= 3;
                overload = true;
            } else if (element >= difficulty) {
                resultOverload++;
            }
        });
    }

    let resultDefault = 0;
    let critic = 0;
    let usedSpecialist = !specialist;

    if (dicesDefault.length > 0) {
        dicesDefault[0].forEach(element => {
            if (element == 10) {
                critic++;
                resultDefault++;
            } else if (element == 1) {
                if (usedSpecialist) {
                    resultDefault--;
                } else {
                    usedSpecialist = true
                }
            } else if (element >= difficulty) {
                resultDefault++;
            }
        });
    }

    if (critic % 2 == 0) {
        critic--;
    }

    const resultFinal = resultOverload + resultDefault + Math.floor(critic / 2);

    return {
        result: resultFinal,
        overload: overload
    }
}