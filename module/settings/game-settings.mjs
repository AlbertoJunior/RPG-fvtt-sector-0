import { RollRepository } from "../../scripts/repository/roll-repository.mjs";

export class GameSettingsUtils {
    static async loadGameSettings() {
        await this.#register(RollRepository._ROLL_HISTORY, RollRepository._CONFIG);
    }

    static async #register(settingId, settingConfig) {
        if (settingId && settingConfig) {
            await game.settings.register("setor0OSubmundo", settingId, settingConfig);
        }
    }

    static get(settingId) {
        return game.settings.get("setor0OSubmundo", settingId);
    }

    static set(settingId, value) {
        return game.settings.set("setor0OSubmundo", settingId, value);
    }
}