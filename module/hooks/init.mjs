import { DOMUtils } from "../utils/dom-listeners.mjs";
import { createDataModels } from "../utils/models.mjs";
import { configureSetor0Combat } from "../base/sheet/combat/setor0-combat.mjs";
import { configureSetor0TokenDocument } from "../core/token/setor0-token.mjs";
import { loadHandlebarsHelpers } from "../utils/handlerbars-helper.mjs";
import { registerTemplates } from "../utils/templates.mjs";
import { ActiveEffectHookHandle } from "./active-effects.mjs";

export class InitHookHandle {
    static async handle() {
        console.log('-> Setor 0 - O Submundo | Inicializando sistema');

        this.#presetConfigs();

        DOMUtils.addListenersOnDOM();

        await createDataModels();
        await configureSetor0Combat();
        await configureSetor0TokenDocument();
        await loadHandlebarsHelpers();
        await registerTemplates();

        ActiveEffectHookHandle.register();
    }

    static #presetConfigs() {
        //CONFIG.debug.hooks = true;
    }
}