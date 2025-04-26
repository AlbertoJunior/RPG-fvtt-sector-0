import { ActorUpdater } from "../../base/updater/actor-updater.mjs";
import { SYSTEM_ID } from "../../constants.mjs";

export class ActiveEffectsUtils {
    static KEYS = {
        TINT_TOKEN: "texture.tint"
    }

    static createEffectData(params) {
        const {
            name = "",
            description = "",
            origin = "",
            img,
            tint,
            disabled = false,
            duration,
            statuses = [],
            changes = [],
            flags = {}
        } = params;

        const fullFlags = {
            originId: "",
            originType: "",
            ...flags
        };

        const activeEffectData = {
            label: name,
            description: description,
            origin: origin,
            img: img,
            tint: tint,
            disabled: disabled,
            duration: duration,
            statuses: statuses,
            changes: changes,
            flags: {
                [SYSTEM_ID]: fullFlags
            }
        };

        return activeEffectData;
    }

    static getFlags(activeEffect) {
        return activeEffect.flags[SYSTEM_ID] || {};
    }

    static getOriginType(activeEffect) {
        return this.getFlags(activeEffect).originType;
    }

    static getOriginId(activeEffect) {
        return this.getFlags(activeEffect).originId;
    }

    static async addEffect(actor, activeEffectData) {
        await ActorUpdater.addEffect(actor, [...activeEffectData]);
    }

    static async removeActorEffect(actor, effectId) {
        const effects = actor.effects;
        for (const effect of effects) {
            const effectOnStatusId = effect.statuses.first();
            if (effectId == effectOnStatusId) {
                await effect.delete();
                return;
            }
        }
    }

    static async removeActorEffectByStatus(actor, statusId) {
        const effect = actor.effects.find(ef => ef.statuses.has(statusId));

        if (effect) {
            await effect.delete();
        }
    }

    static async removeActorEffectByOriginId(actor, originId) {
        const effect = actor.effects.find(e => this.getOriginId(e) === originId);

        if (effect) {
            await effect.delete();
        }
    }

    static getEffectByOriginId(actor, originId, originType) {
        return actor.effects.find(e => {
            const origin = this.getOriginId(e);
            const type = this.getOriginType(e);
            return origin === originId && type === originType;
        });
    }

    static getEffectsByChangeKey(actor, changeKey) {
        return actor.effects._source.map(effect => effect.changes)
            .filter(a => a.length > 0).flat()
            .filter(a => a.key == changeKey);
    }

    static async enableEffect(effect) {
        if (effect) {
            await effect.update({ disabled: false });
        }
    }

    static async disableEffect(effect) {
        if (effect) {
            await effect.update({ disabled: true });
        }
    }
}