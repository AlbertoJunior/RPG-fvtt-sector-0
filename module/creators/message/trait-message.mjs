import { TEMPLATES_PATH } from "../../constants.mjs";

export class TraitMessageCreator {
    static async mountContent(params) {
        const data = {
            ...params,
        };
        return await renderTemplate(`${TEMPLATES_PATH}/messages/trait.hbs`, data);
    }
}