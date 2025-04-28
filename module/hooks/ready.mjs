import { OscillatingTintManager } from "../core/effect/oscilating-effect.mjs";
import { RepositoriesUtils } from "../utils/repositories.mjs";
import { ActiveEffectRepository } from "../repository/active-effects-repository.mjs";
import { MacroSync } from "../core/macro/macro-sync.mjs";
import { MacroInstaller } from "../core/macro/macro-installer.mjs";
import { MacroUtils } from "../core/macro/macro-utils.mjs";

export class ReadyHookHandle {
    static async handle() {
        await RepositoriesUtils.loadFromPackages();
        await RepositoriesUtils.loadFromGame();

        CONFIG.statusEffects = ActiveEffectRepository._getItems();

        await MacroSync.verifyDefaultMacroCompendium();
        await MacroInstaller.installDefaultMacrosOnUser();
        await MacroUtils.exposeMethodsForMacros();

        if (!game.user.isGM) {
            console.log('-> Setor 0 - O Submundo | Sistema Pronto');
            return;
        }

        await MacroInstaller.installDefaultMacrosOnGm();

        this.#loadOnlyForGm();
    }

    static async #loadOnlyForGm() {
        OscillatingTintManager.verifyOscilatingTokens();
        console.log('-> Setor 0 - O Submundo | Sistema Pronto');
    }
}