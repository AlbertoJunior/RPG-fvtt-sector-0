import { ActorUtils } from "../actor/actor-utils.mjs";

export class CoreRollMethods {
    static async rollDiceAmountWithOverload(actor, diceAmount) {
        const overloadDiceAmount = CoreRollMethods.calculateOverloadDiceAmount(actor, diceAmount);
        const finalDiceAmount = CoreRollMethods.calculateDiceAmount(overloadDiceAmount, diceAmount);

        const [rollOverloadResults, rollDefaultResults] = await Promise.all(
            [
                CoreRollMethods.rollDice(overloadDiceAmount),
                CoreRollMethods.rollDice(finalDiceAmount)
            ]
        );

        return {
            overload: rollOverloadResults,
            default: rollDefaultResults
        }
    }

    static async rollDice(amount) {
        if (amount > 0) {
            const rollFormula = `${amount}d10`;
            const roll = new Roll(rollFormula);
            await roll.evaluate();

            return {
                roll: roll,
                values: this.getValuesOnRoll(roll)
            };
        }

        return {
            roll: undefined,
            values: []
        };
    };

    static getValuesOnRoll(roll) {
        return roll.dice.flatMap(dice => dice.results.map(result => result.result));
    }

    static calculateOverloadDiceAmount(actor, diceAmount) {
        return Math.min(ActorUtils.getOverload(actor), diceAmount);
    }

    static calculateDiceAmount(overloadDiceAmount, diceAmount) {
        return Math.max(diceAmount - overloadDiceAmount, 0);
    }

    static calculateSuccess(dicesOverload, dicesDefault, specialist, difficulty, criticDifficulty, automatic) {
        let resultOverload = 0;
        let overload = false;
        for (const element of dicesOverload) {
            if (element == 10) {
                resultOverload += 3;
                overload = true;
            } else if (element == 1) {
                resultOverload -= 3;
                overload = true;
            } else if (element >= difficulty) {
                resultOverload++;
            }
        }

        let resultDefault = 0;
        let criticCount = 0;
        let usedSpecialist = !specialist;

        for (const element of dicesDefault) {
            if (element == 10 || (element >= criticDifficulty && element >= difficulty)) {
                criticCount++;
                resultDefault++;
            } else if (element == 1) {
                if (usedSpecialist) {
                    resultDefault--;
                    criticCount--;
                } else {
                    usedSpecialist = true
                }
            } else if (element >= difficulty) {
                resultDefault++;
            }
        }

        if (criticCount > 0 && criticCount % 2 !== 0) {
            criticCount--;
        }
        const resultCritic = Math.floor(Math.max(criticCount, 0) / 2);

        const resultWithoutAutomatic = resultOverload + resultDefault + resultCritic;
        const resultFinal = resultWithoutAutomatic + (resultWithoutAutomatic > 0 ? automatic : 0);

        return {
            result: resultFinal,
            overload: overload
        }
    }
}