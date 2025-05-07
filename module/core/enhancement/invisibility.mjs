import { ICONS_PATH } from "../../constants.mjs";
import { RollTestDataModel } from "../../data/roll-test-data-model.mjs";
import { CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { EffectChangeValueType, EnhancementDuration, EnhancementOverload } from "../../enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../field/actor-enhancement-field.mjs";
import { ActiveEffectsUtils } from "../effect/active-effects.mjs";

const invisibilityEffects = [
    EnhancementEffectField._toJson(
        '33',
        'Esconder',
        1,
        EnhancementOverload.NONE,
        EnhancementDuration.SCENE,
        [],
        [],
        [
            RollTestDataModel._toJson(
                {
                    name: "Manter Esconder",
                    primary_attribute: CharacteristicType.ATTRIBUTES.INTELLIGENCE.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.CHARISMA.id,
                    ability: CharacteristicType.SKILLS.FURTIVITY.id,
                    difficulty: 6
                }
            ),
        ]
    ),
    EnhancementEffectField._toJson(
        '34',
        'Supressão de Ruídos',
        1,
        EnhancementOverload.NONE,
        EnhancementDuration.SCENE,
        []
    ),
    EnhancementEffectField._toJson(
        '35',
        'Silenciar',
        1,
        EnhancementOverload.NONE,
        EnhancementDuration.SCENE,
        []
    ),
    EnhancementEffectField._toJson(
        '36',
        'Camuflagem',
        2,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['33', '34', '35'],
        [
            {
                key: ActiveEffectsUtils.KEYS.TINT_TOKEN,
                mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                otherValue: "#55C8FA",
                typeOfValue: EffectChangeValueType.OTHER_VALUE,
                priority: 20
            },
        ],
        [
            RollTestDataModel._toJson(
                {
                    name: "Manter Camuflagem",
                    primary_attribute: CharacteristicType.ATTRIBUTES.INTELLIGENCE.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.CHARISMA.id,
                    ability: CharacteristicType.SKILLS.FURTIVITY.id,
                    difficulty: 6
                }
            ),
        ]
    ),
    EnhancementEffectField._toJson(
        '37',
        'Fantasma',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['36'],
    ),
    EnhancementEffectField._toJson(
        '38',
        'Um na multidão',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['36']
    ),
    EnhancementEffectField._toJson(
        '39',
        'Desaparecer',
        4,
        EnhancementOverload.ONE_TESTED_EFFECT_COST,
        EnhancementDuration.SCENE,
        ['37', '38']
    ),
    EnhancementEffectField._toJson(
        '40',
        'Incógnito',
        5,
        EnhancementOverload.ONE_FIXED,
        EnhancementDuration.SCENE,
        ['39']
    )
];

export const invisibilityEnhancement = {
    id: '5',
    name: 'Invisibilidade',
    value: 'invisibilidade',
    icon: `${ICONS_PATH}/invisibility.svg`,
    effects: invisibilityEffects
};