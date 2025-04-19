import { OscillatingTintManager } from "../core/effect/oscilating-effect.mjs";
import { RepositoriesUtils } from "../utils/repositories.mjs";

export class ReadyHookHandle {
    static async handle() {
        await RepositoriesUtils.loadFromPackages();
        await RepositoriesUtils.loadFromGame();

        if (!game.user.isGM) {
            console.log('-> Setor 0 - O Submundo | Sistema Pronto');
            return;
        }

        OscillatingTintManager.verifyOscilatingTokens();
        console.log('-> Setor 0 - O Submundo | Sistema Pronto');
    }
}