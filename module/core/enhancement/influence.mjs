import { ICONS_PATH } from "../../constants.mjs";
import { EffectChangeValueType, EnhancementDuration, EnhancementOverload } from "../../enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../field/actor-enhancement-field.mjs";
import { ActiveEffectsUtils } from "../effect/active-effects.mjs";

const influenceEffects = [
    EnhancementEffectField._toJson(
        '25',
        'Encantar',
        1,
        EnhancementOverload.NONE,
        EnhancementDuration.PASSIVE,
        []
    ),
    EnhancementEffectField._toJson(
        '26',
        'Apavorar',
        1,
        EnhancementOverload.NONE,
        EnhancementDuration.PASSIVE,
        []
    ),
    EnhancementEffectField._toJson(
        '27',
        'Vício',
        2,
        EnhancementOverload.NONE,
        EnhancementDuration.PASSIVE,
        ['25', '26']
    ),
    EnhancementEffectField._toJson(
        '28',
        'Mesmerizar',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['27']
    ),
    EnhancementEffectField._toJson(
        '29',
        'Esquecimento',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.USE,
        ['27']
    ),
    EnhancementEffectField._toJson(
        '30',
        'Magnetismo',
        4,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['28', '29']
    ),
    EnhancementEffectField._toJson(
        '31',
        'Racionalizar',
        4,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.USE,
        ['28', '29']
    ),
    EnhancementEffectField._toJson(
        '32',
        'Divindade',
        5,
        EnhancementOverload.ONE_FIXED_ONE_TEST,
        EnhancementDuration.SCENE,
        ['30', '31'],
        [
            { key: 'bonus.iniciativa', value: 1, typeOfValue: EffectChangeValueType.HALF_ENHANCEMENT_LEVEL_PLUS_FIXED },
            {
                key: ActiveEffectsUtils.KEYS.TINT_TOKEN,
                mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                otherValue: "#FFDC00",
                typeOfValue: EffectChangeValueType.OTHER_VALUE,
                priority: 20
            },
        ]
    )
];

export const influenceEnhancement = {
    id: '4',
    name: 'Indução',
    value: 'inducao',
    icon: `${ICONS_PATH}/influence.svg`,
    effects: influenceEffects
};