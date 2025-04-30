import { ICONS_PATH, SYSTEM_ID } from "../constants.mjs";
import { ActiveEffectsUtils } from "../core/effect/active-effects.mjs";
import { CharacteristicType } from "../enums/characteristic-enums.mjs";

export class ActiveEffectRepository {
    static items = [
        ActiveEffectsUtils.createEffectData({
            name: "Sangrando",
            img: `${ICONS_PATH}/user-ninja.svg`,
            duration: { startRound: 0, rounds: 99 },
            changes: [
                { key: `flags.${SYSTEM_ID}.bleeding`, mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: 1 }
            ]
        }),
        ActiveEffectsUtils.createEffectData({
            name: "Surpreendido",
            img: `${ICONS_PATH}/user-ninja.svg`,
            duration: { startRound: 0, rounds: 1 },
            changes: [
                { key: CharacteristicType.BONUS.PM.system, mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: -99 }
            ]
        }),
    ];

    static #permitedDefault = [
        'dead', 'blind', 'burning', 'shock', 'poison', 'invisible', 'paralysis'
    ]

    static #getFoundryDefaultEffects() {
        return CONFIG.statusEffects.filter(effect => this.#permitedDefault.includes(effect.id));
    }

    static _getItems() {
        return [... this.items, ...this.#getFoundryDefaultEffects()];
    }
}