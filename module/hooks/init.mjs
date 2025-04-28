import { DOMUtils } from "../utils/dom-listeners.mjs";
import { createDataModels } from "../../scripts/utils/models.mjs";
import { configureSetor0Combat } from "../core/combat/setor0-combat.mjs";
import { configureSetor0TokenDocument } from "../core/token/setor0-token.mjs";
import { GameSettingsUtils } from "../settings/game-settings.mjs";
import { loadHandlebarsHelpers } from "../../scripts/utils/handlerbars-helper.mjs";
import { registerTemplates } from "../../scripts/utils/templates.mjs";

export class InitHookHandle {
    static async handle() {
        console.log('-> Setor 0 - O Submundo | Inicializando sistema');

        this.#presetConfigs();

        DOMUtils.addListenersOnDOM();

        await createDataModels();
        await configureSetor0Combat();
        await configureSetor0TokenDocument();
        await GameSettingsUtils.loadGameSettings();
        await loadHandlebarsHelpers();
        await registerTemplates();
    }

    static #presetConfigs() {
        //CONFIG.debug.hooks = true;
    }
}