import { localize } from "../../../scripts/utils/utils.mjs";
import { TEMPLATES_PATH } from "../../constants.mjs";

export class RollOverloadMessageCreator {
    static async mountContent(params) {
        const { core, values, success, missed } = params;
        const isSuccess = missed <= 0;
        const data = {
            core: core,
            diceValues: values,
            resultMessage: isSuccess ? localize('Sucesso') : localize('Falha'),
            resultValue: success,
            resultMessageClasses: isSuccess ? `S0-success` : 'S0-failure'
        };
        return await renderTemplate(`${TEMPLATES_PATH}/messages/roll-overload.hbs`, data);
    }
}