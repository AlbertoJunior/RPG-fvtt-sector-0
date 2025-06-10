import { ActiveEffectsFlags, ActiveEffectsOriginTypes, ActiveEffectsTypes } from "../../../enums/active-effects-enums.mjs";
import { CharacteristicType } from "../../../enums/characteristic-enums.mjs";
import { influenceEnhancement } from "../../enhancement/enhancement-items/influence.mjs";
import { ActiveEffectsUtils } from "../active-effects.mjs";

const addicted = ActiveEffectsUtils.createEffectData({
    id: 'CustomActiveEffect.Viciado',
    name: "Viciado",
    origin: `Aprimoramento: ${influenceEnhancement.name}`,
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
    id: 'CustomActiveEffect.Mesmerizado',
    name: "Mesmerizado",
    origin: `Aprimoramento: ${influenceEnhancement.name}`,
    img: `${influenceEnhancement.icon}`,
    duration: { rounds: 99, startTime: 0 },
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
    id: 'CustomActiveEffect.Racionalizando',
    name: "Racionalizando",
    origin: `Aprimoramento: ${influenceEnhancement.name}`,
    img: `${influenceEnhancement.icon}`,
    duration: { rounds: 99, startTime: 0 },
    tint: "#FFDC00",
    changes: [],
    flags: {
        [ActiveEffectsFlags.ORIGIN_ID]: 'CustomActiveEffect.Racionalizando',
        [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.AFFECTED_ENHANCEMENT,
        [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.DEBUFF,
    }
});

const fascinated = ActiveEffectsUtils.createEffectData({
    id: 'CustomActiveEffect.Fascinado',
    name: "Fascinado",
    origin: `Aprimoramento: ${influenceEnhancement.name}`,
    img: `${influenceEnhancement.icon}`,
    duration: { rounds: 99, startTime: 0 },
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