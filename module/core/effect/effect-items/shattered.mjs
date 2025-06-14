import { ActiveEffectsFlags, ActiveEffectsOriginTypes, ActiveEffectsTypes } from "../../../enums/active-effects-enums.mjs";
import { CharacteristicType } from "../../../enums/characteristic-enums.mjs";
import { brutalityEnhancement } from "../../enhancement/enhancement-items/brutality.mjs";
import { ActiveEffectsUtils } from "../active-effects.mjs";

const shattered1Id = 'CustomActiveEffect.Destroçado1';
const shattered2Id = 'CustomActiveEffect.Destroçado2';
const shattered3Id = 'CustomActiveEffect.Destroçado3';

const shattered1 = ActiveEffectsUtils.createEffectData({
    id: shattered1Id,
    name: "Destroçado 1",
    origin: `Aprimoramento: ${brutalityEnhancement.name}`,
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
        [ActiveEffectsFlags.ORIGIN_ID]: shattered1Id,
        [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.AFFECTED_ENHANCEMENT,
        [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.DEBUFF,
        [ActiveEffectsFlags.REMOVE_EFFECTS]: [shattered2Id, shattered3Id],
    }
});

const shattered2 = ActiveEffectsUtils.createEffectData({
    id: shattered2Id,
    name: "Destroçado 2",
    origin: `Aprimoramento: ${brutalityEnhancement.name}`,
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
        [ActiveEffectsFlags.ORIGIN_ID]: shattered2Id,
        [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.AFFECTED_ENHANCEMENT,
        [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.DEBUFF,
        [ActiveEffectsFlags.REMOVE_EFFECTS]: [shattered1Id, shattered3Id],
    }
});

const shattered3 = ActiveEffectsUtils.createEffectData({
    id: shattered3Id,
    name: "Destroçado 3",
    origin: `Aprimoramento: ${brutalityEnhancement.name}`,
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
        [ActiveEffectsFlags.ORIGIN_ID]: shattered3Id,
        [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.AFFECTED_ENHANCEMENT,
        [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.DEBUFF,
        [ActiveEffectsFlags.REMOVE_EFFECTS]: [shattered1Id, shattered2Id],
    }
});

export const shatteredActiveEffects = [shattered1, shattered2, shattered3];