export class CoreRollMethods {
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
        let critic = 0;
        let usedSpecialist = !specialist;

        for (const element of dicesDefault) {
            if (element == 10 || (element >= criticDifficulty && element >= difficulty)) {
                critic++;
                resultDefault++;
            } else if (element == 1) {
                if (usedSpecialist) {
                    resultDefault--;
                    critic--;
                } else {
                    usedSpecialist = true
                }
            } else if (element >= difficulty) {
                resultDefault++;
            }
        }

        if (critic > 0 && critic % 2 !== 0) {
            critic--;
        }

        const resultWithoutAutomatic = resultOverload + resultDefault + Math.floor(Math.max(critic, 0) / 2);
        const resultFinal = resultWithoutAutomatic + (resultWithoutAutomatic > 0 ? automatic : 0);

        return {
            result: resultFinal,
            overload: overload
        }
    }
}