import { configureSetor0Combat } from "../core/combat/setor0-combat.mjs";
import { DOMUtils } from "../utils/dom-listeners.mjs";
import { createDataModels } from "../../scripts/utils/models.mjs";
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
        await GameSettingsUtils.loadGameSettings();
        await loadHandlebarsHelpers();
        await registerTemplates();
    }

    static #presetConfigs() {
        //CONFIG.debug.hooks = true;
    }
}