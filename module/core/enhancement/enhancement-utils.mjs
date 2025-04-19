import { EffectChangeValueType, EnhancementDuration } from "../../enums/enhancement-enums.mjs";
import { EnhancementRepository } from "../../repository/enhancement-repository.mjs";
import { ActorUtils } from "../../utils/actor-utils.mjs";
import { ActiveEffectsUtils } from "../effect/active-effects.mjs";

export class EnhancementUtils {
    static valueCalculators = {
        [EffectChangeValueType.FIXED]: (value, enhancementLevel) => value,
        [EffectChangeValueType.ENHANCEMENT_LEVEL]: (value, enhancementLevel) => enhancementLevel,
        [EffectChangeValueType.HALF_ENHANCEMENT_LEVEL]: (value, enhancementLevel) => Math.floor(enhancementLevel / 2),
        [EffectChangeValueType.ENHANCEMENT_LEVEL_PLUS_FIXED]: (value, enhancementLevel) => enhancementLevel + value,
        [EffectChangeValueType.HALF_ENHANCEMENT_LEVEL_PLUS_FIXED]: (value, enhancementLevel) => Math.floor(enhancementLevel / 2) + value,
        [EffectChangeValueType.OTHER_VALUE]: (value, enhancementLevel, otherValue) => otherValue,
    };

    static valueCalculator(change, enhancementLevel) {
        const typeOfValue = change.typeOfValue;
        const value = change.value;
        const otherValue = change.otherValue;
        return this.valueCalculators[typeOfValue]?.(value, enhancementLevel, otherValue) || 0;
    }

    static verifyAndSetEffectChanges(actor, activeEffectData, effectChanges, enhancement) {
        if (effectChanges.length > 0) {
            const enhancementLevel = ActorUtils.getEnhancementLevel(actor, enhancement);

            activeEffectData.changes = effectChanges.map(change => {
                const value = this.valueCalculator(change, enhancementLevel);
                const verifiedKey = change.key.system ? change.key.system : change.key;
                const verifiedMode = change.mode ? change.mode : CONST.ACTIVE_EFFECT_MODES.ADD;

                return {
                    key: verifiedKey,
                    mode: verifiedMode,
                    value: value
                }
            });
        }
    }

    static configureActiveEffect(activeEffectData, effect, enhancement) {
        const duration = effect.duration;
        this.#configureActiveEffectDuration(activeEffectData, duration);
        this.#configureActiveEffectIcon(activeEffectData, duration, enhancement.id);
        this.#configureActiveEffectTint(activeEffectData, duration, effect.id);
    }

    static #configureActiveEffectDuration(activeEffectData, effectDuration) {
        let durationObject;

        switch (effectDuration) {
            case EnhancementDuration.SCENE: {
                const flags = ActiveEffectsUtils.getFlags(activeEffectData);
                const haveFlagCombat = flags.combatId != undefined && flags.combatId !== '';
                if (haveFlagCombat) {
                    const combat = game.combat

                    durationObject = {
                        startRound: combat?.round,
                        startTurn: combat?.turn,
                        rounds: 10,
                        combat: combat
                    };
                } else {
                    durationObject = { rounds: 99, startTime: 0 };
                }
                break;
            }
            case EnhancementDuration.USE: {
                durationObject = { rounds: 1, startRound: 0 };
                break;
            }
        }

        activeEffectData.duration = durationObject;
    }

    static #configureActiveEffectIcon(activeEffectData, effectDuration, enhancementId) {
        if (effectDuration == EnhancementDuration.SCENE) {
            const enhancement = EnhancementRepository._getEnhancementById(enhancementId);
            if (!enhancement) {
                return;
            }
            activeEffectData.img = enhancement.icon;
        }
    }

    static #configureActiveEffectTint(activeEffectData, effectDuration, levelId) {
        if (effectDuration == EnhancementDuration.SCENE) {
            const effect = EnhancementRepository._getEnhancementEffectById(levelId);
            if (!effect) {
                return;
            }

            let tint = "#FFFFFF"
            switch (effect.level) {
                case 1: {
                    tint = "#FFFFFF";
                    break;
                }
                case 2: {
                    tint = "#FFE682";
                    break;
                }
                case 3: {
                    tint = "#FFDC00";
                    break;
                }
                case 4: {
                    tint = "#F07823";
                    break;
                }
                case 5: {
                    tint = "#F00A0A";
                    break;
                }
            }

            activeEffectData.tint = tint;
        }
    }
}