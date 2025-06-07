import { TEMPLATES_PATH } from "../../constants.mjs";

export class RollInitiativeMessageCreator {
    static async mountContent(params) {
        const { initiative, value, total, values } = params;
        const data = {
            initiative: initiative,
            value: value,
            total: total,
            diceValues: values,
        };
        return await renderTemplate(`${TEMPLATES_PATH}/messages/roll-initiative.hbs`, data);
    }
}