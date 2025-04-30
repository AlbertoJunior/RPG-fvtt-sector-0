import { ActiveEffectsUtils } from "../core/effect/active-effects.mjs";
import { OscillatingTintManager } from "../core/effect/oscilating-effect.mjs";
import { ActorUtils } from "../core/actor/actor-utils.mjs";

export class ActiveEffectHookHandle {
    static register() {
        Hooks.on("createActiveEffect", ActiveEffectHookHandle.#onCreateActiveEffect);
        Hooks.on("deleteActiveEffect", ActiveEffectHookHandle.#onDeleteActiveEffect);
    }

    static async #onCreateActiveEffect(effect, options, userId) {
        await ActiveEffectHookHandle.#verifyChangeTokenTint(effect);
    }

    static async #onDeleteActiveEffect(effect, options, userId) {
        await ActiveEffectHookHandle.#verifyRemoveTokenTint(effect);
    }

    static async #verifyChangeTokenTint(effect) {
        const actor = effect.parent;
        
        const token = ActorUtils.getToken(actor);
        if (!token) {
            return;
        }

        const hasMultipleTints = actor.effects.filter(e => e.changes.some(c => c.key === ActiveEffectsUtils.KEYS.TINT_TOKEN)).length > 1;
        if (hasMultipleTints) {
            OscillatingTintManager.startOscillationForToken(token);
        } else {
            const tintChange = effect.changes.find(c => c.key === ActiveEffectsUtils.KEYS.TINT_TOKEN);
            if (tintChange) {
                await token.document.update({ [ActiveEffectsUtils.KEYS.TINT_TOKEN]: tintChange.value });
            }
        }
    }

    static async #verifyRemoveTokenTint(effect) {
        const actor = effect.parent;
        
        const token = ActorUtils.getToken(actor);
        if (!token) {
            return;
        }

        const hasMultipleTints = actor.effects.filter(e => e.changes.some(c => c.key === ActiveEffectsUtils.KEYS.TINT_TOKEN)).length > 1;
        if (hasMultipleTints) {
            OscillatingTintManager.startOscillationForToken(token);
        } else {
            OscillatingTintManager.stopOscillationForToken(token);
        }
    }
}
