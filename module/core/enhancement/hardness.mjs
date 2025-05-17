import { ICONS_PATH } from "../../constants.mjs";
import { RollTestDataModel } from "../../data/roll-test-data-model.mjs";
import { BaseActorCharacteristicType, CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { EffectChangeValueType, EnhancementDuration, EnhancementOverload } from "../../enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../field/actor-enhancement-field.mjs";
import { ActiveEffectsUtils } from "../effect/active-effects.mjs";

const hardnessEffects = [
    EnhancementEffectField._toJson(
        '50',
        'Resiliência',
        1,
        EnhancementOverload.NONE,
        EnhancementDuration.PASSIVE,
        [],
        [
            { key: BaseActorCharacteristicType.VITALITY.TOTAL, value: 0, typeOfValue: EffectChangeValueType.ENHANCEMENT_LEVEL },
        ]
    ),
    EnhancementEffectField._toJson(
        '51',
        'Dureza',
        2,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['50'],
        [],
        [
            RollTestDataModel._toJson(
                {
                    name: "Ativar no Reflexo",
                    primary_attribute: CharacteristicType.ATTRIBUTES.STAMINA.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.PERCEPTION.id,
                    ability: CharacteristicType.SKILLS.INVESTIGATION.id,
                    difficulty: 7
                }
            ),
        ]
    ),
    EnhancementEffectField._toJson(
        '52',
        'Pele de Aço',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['51'],
        [
            {
                key: ActiveEffectsUtils.KEYS.TINT_TOKEN,
                mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                otherValue: "#FF0200",
                typeOfValue: EffectChangeValueType.OTHER_VALUE,
                priority: 20
            },
        ]
    ),
    EnhancementEffectField._toJson(
        '53',
        'Inquebrável',
        4,
        EnhancementOverload.ONE_FIXED,
        EnhancementDuration.SCENE,
        ['52']
    ),
    EnhancementEffectField._toJson(
        '54',
        'Troco',
        4,
        EnhancementOverload.ONE_FIXED,
        EnhancementDuration.SCENE,
        ['52']
    ),
    EnhancementEffectField._toJson(
        '55',
        'Proeza da Dor',
        5,
        EnhancementOverload.ONE_FIXED,
        EnhancementDuration.SCENE,
        ['53', '54'],
        [
            { key: CharacteristicType.BONUS.DAMAGE_PENALTY, value: -99, typeOfValue: EffectChangeValueType.FIXED },
        ]
    ),
    EnhancementEffectField._toJson(
        '56',
        'Última Chance',
        5,
        EnhancementOverload.NONE,
        EnhancementDuration.PASSIVE,
        ['53', '54']
    )
];

export const hardnessEnhancement = {
    id: '7',
    name: 'Rigidez',
    value: 'rigidez',
    icon: `${ICONS_PATH}/hardness.svg`,
    effects: hardnessEffects
};