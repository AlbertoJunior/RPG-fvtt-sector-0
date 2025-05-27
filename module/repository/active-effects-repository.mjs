import { influencedActiveEffects } from "../core/effect/effect-items/influecedEffects.mjs";
import { shatteredActiveEffects } from "../core/effect/effect-items/shattered.mjs";
import { simulatedActiveEffect } from "../core/effect/effect-items/simulated.mjs";
import { surprisedActiveEffect } from "../core/effect/effect-items/surprised.mjs";

export class ActiveEffectRepository {
    static #items = [
        surprisedActiveEffect,
        simulatedActiveEffect,
        ...influencedActiveEffects,
        ...shatteredActiveEffects,
    ];

    static #permitedDefault = [
        'dead', 'blind', 'burning', 'shock', 'poison', 'paralysis'
    ];

    static #getFoundryDefaultEffects() {
        return CONFIG.statusEffects.filter(effect => this.#permitedDefault.includes(effect.id));
    }

    static _getItems() {
        return [
            ...this.#items,
            ...this.#getFoundryDefaultEffects()
        ].filter(Boolean);
    }
}