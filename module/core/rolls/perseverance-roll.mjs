import { CoreRollMethods } from "./core-roll-methods.mjs";

export class RollPerseverance {
    static async rerrollValues(values) {
        const resultRoll = await CoreRollMethods.rollDice(Math.min(2, values.length));

        const minors = this.#getTwoMinorValues(values);
        const newValues = this.#removeValues(values, minors);

        return {
            roll: resultRoll.roll,
            values: [...newValues, ...resultRoll.values],
            oldVaues: [...values],
            removedValues: [...minors]
        }
    }

    static #getTwoMinorValues(values) {
        if (values.length < 2) {
            return values;
        }

        values.sort((a, b) => a - b);
        return values.slice(0, 2);
    }

    static #removeValues(values, valuesToRemove) {
        const newValues = [...values];
        valuesToRemove.forEach(element => {
            const index = newValues.indexOf(element);
            if (index !== -1) {
                newValues.splice(index, 1);
            }
        });

        return newValues;
    }
}