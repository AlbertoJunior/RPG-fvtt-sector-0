import { ActiveEffectsFlags, ActiveEffectsOriginTypes, ActiveEffectsTypes } from "../../../enums/active-effects-enums.mjs";
import { CharacteristicType } from "../../../enums/characteristic-enums.mjs";
import { brutalityEnhancement } from "../../enhancement/brutality.mjs";
import { ActiveEffectsUtils } from "../active-effects.mjs";

const shattered1 = ActiveEffectsUtils.createEffectData({
    name: "Destroçado 1",
    img: `${brutalityEnhancement.icon}`,
    duration: { startRound: 0, rounds: 99 },
    tint: "#FFDC00",
    changes: [
        {
            key: CharacteristicType.BONUS.DAMAGE_PENALTY_FLAT.system,
            value: 3,
            mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
            priority: 100
        },
    ],
    flags: {
        [ActiveEffectsFlags.ORIGIN_ID]: 'CustomActiveEffect.Destroçado1',
        [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.AFFECTED_ENHANCEMENT,
        [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.DEBUFF,
    }
});

const shattered2 = ActiveEffectsUtils.createEffectData({
    name: "Destroçado 2",
    img: `${brutalityEnhancement.icon}`,
    duration: { startRound: 0, rounds: 99 },
    tint: "#F07823",
    changes: [
        {
            key: CharacteristicType.BONUS.DAMAGE_PENALTY_FLAT.system,
            value: 4,
            mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
            priority: 200
        },
    ],
    flags: {
        [ActiveEffectsFlags.ORIGIN_ID]: 'CustomActiveEffect.Destroçado2',
        [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.AFFECTED_ENHANCEMENT,
        [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.DEBUFF,
        [ActiveEffectsFlags.REMOVE_EFFECTS]: ['CustomActiveEffect.Destroçado1'],
    }
});

const shattered3 = ActiveEffectsUtils.createEffectData({
    name: "Destroçado 3",
    img: `${brutalityEnhancement.icon}`,
    duration: { startRound: 0, rounds: 99 },
    tint: "#F00A0A",
    changes: [
        {
            key: CharacteristicType.BONUS.DAMAGE_PENALTY_FLAT.system,
            value: 5,
            mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
            priority: 300
        },
    ],
    flags: {
        [ActiveEffectsFlags.ORIGIN_ID]: 'CustomActiveEffect.Destroçado3',
        [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.AFFECTED_ENHANCEMENT,
        [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.DEBUFF,
        [ActiveEffectsFlags.REMOVE_EFFECTS]: ['CustomActiveEffect.Destroçado1', 'CustomActiveEffect.Destroçado2'],
    }
});

export const shatteredActiveEffects = [shattered1, shattered2, shattered3];