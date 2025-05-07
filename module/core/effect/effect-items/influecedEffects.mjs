import { ActiveEffectsFlags, ActiveEffectsOriginTypes, ActiveEffectsTypes } from "../../../enums/active-effects-enums.mjs";
import { CharacteristicType } from "../../../enums/characteristic-enums.mjs";
import { influenceEnhancement } from "../../enhancement/influence.mjs";
import { ActiveEffectsUtils } from "../active-effects.mjs";

const addicted = ActiveEffectsUtils.createEffectData({
    name: "Viciado",
    img: `${influenceEnhancement.icon}`,
    tint: "#FFDC00",
    changes: [
        {
            key: CharacteristicType.BONUS.VIRTUES.PERSEVERANCE.system,
            value: -1,
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        },
    ],
    flags: {
        [ActiveEffectsFlags.ORIGIN_ID]: 'CustomActiveEffect.Viciado',
        [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.AFFECTED_ENHANCEMENT,
        [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.DEBUFF,
    }
});

const mesmerized = ActiveEffectsUtils.createEffectData({
    name: "Mesmerizado",
    img: `${influenceEnhancement.icon}`,
    tint: "#FFDC00",
    changes: [
        {
            key: CharacteristicType.BONUS.VIRTUES.CONSCIOUSNESS.system,
            value: -1,
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        },
    ],
    flags: {
        [ActiveEffectsFlags.ORIGIN_ID]: 'CustomActiveEffect.Mesmerizado',
        [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.AFFECTED_ENHANCEMENT,
        [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.DEBUFF,
    }
});

const racionalize = ActiveEffectsUtils.createEffectData({
    name: "Racionalizando",
    img: `${influenceEnhancement.icon}`,
    tint: "#FFDC00",
    changes: [],
    flags: {
        [ActiveEffectsFlags.ORIGIN_ID]: 'CustomActiveEffect.Racionalizando',
        [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.AFFECTED_ENHANCEMENT,
        [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.DEBUFF,
    }
});

const fascinated = ActiveEffectsUtils.createEffectData({
    name: "Fascinado",
    img: `${influenceEnhancement.icon}`,
    tint: "#FFDC00",
    changes: [
        {
            key: CharacteristicType.BONUS.VIRTUES.QUIETNESS.system,
            value: -1,
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        },
    ],
    flags: {
        [ActiveEffectsFlags.ORIGIN_ID]: 'CustomActiveEffect.Fascinado',
        [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.AFFECTED_ENHANCEMENT,
        [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.DEBUFF,
    }
});

export const influencedActiveEffects = [addicted, mesmerized, racionalize, fascinated];