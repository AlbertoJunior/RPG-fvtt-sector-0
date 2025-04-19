import { localize } from "../../../scripts/utils/utils.mjs";

export class RollLifeMessageCreator {
    static async mountContent(params) {
        const { life, values, success, missed } = params;
        const isSuccess = missed <= 0;
        const colorValue = 70 - ((values[0]-1) * 15);
        const data = {
            life: life,
            colorValue: colorValue,
            diceValues: values,
            resultMessage: isSuccess ? localize('Sucesso') : localize('Falha'),
            resultValue: success,
            resultMessageClasses: isSuccess ? `S0-success` : 'S0-failure'
        };
        return await renderTemplate("systems/setor0OSubmundo/templates/messages/roll-life.hbs", data);
    }
}