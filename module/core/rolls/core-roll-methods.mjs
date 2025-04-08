export class CoreRollMethods {
    static async rollDice(amount) {
        if (amount > 0) {
            const rollFormula = `${amount}d10`;
            const roll = new Roll(rollFormula);
            await roll.evaluate();

            return {
                roll: roll,
                values: roll.dice.flatMap(dice => dice.results.map(result => result.result))
            };
        }

        return {
            roll: undefined,
            values: []
        };
    };

    static calculateSuccess(dicesOverload, dicesDefault, specialist, difficulty) {
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
        }

        if (critic % 2 !== 0) {
            critic--;
        }

        const resultFinal = resultOverload + resultDefault + Math.floor(critic / 2);

        return {
            result: resultFinal,
            overload: overload
        }
    }
}