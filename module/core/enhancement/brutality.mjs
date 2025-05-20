import { ICONS_PATH } from "../../constants.mjs";
import { RollTestDataModel } from "../../data/roll-test-data-model.mjs";
import { CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { EffectChangeValueType, EnhancementDuration, EnhancementOverload } from "../../enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../field/enhancement-field.mjs";

const brutalityEffects = [
    EnhancementEffectField._toJson(
        '18',
        'Força Brutal',
        1,
        EnhancementOverload.NONE,
        EnhancementDuration.PASSIVE,
        [],
        [
            { key: CharacteristicType.BONUS.ATTRIBUTES.STRENGTH, value: 0, typeOfValue: EffectChangeValueType.ENHANCEMENT_LEVEL },
        ]
    ),
    EnhancementEffectField._toJson(
        '19',
        'Fanático',
        2,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['18'],
        [],
        [
            RollTestDataModel._toJson(
                {
                    name: "Encontrão",
                    primary_attribute: CharacteristicType.ATTRIBUTES.STRENGTH.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.DEXTERITY.id,
                    ability: CharacteristicType.SKILLS.ATHLETICS.id,
                    difficulty: 5
                }
            ),
        ]
    ),
    EnhancementEffectField._toJson(
        '20',
        'Força Esmagadora',
        2,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['18'],
        [],
        [
            RollTestDataModel._toJson(
                {
                    name: "Agarrar",
                    primary_attribute: CharacteristicType.ATTRIBUTES.STRENGTH.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.DEXTERITY.id,
                    ability: CharacteristicType.SKILLS.ATHLETICS.id,
                    difficulty: 5
                }
            ),
        ],
    ),
    EnhancementEffectField._toJson(
        '21',
        'Canhão',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['19', '20'],
        [],
        [
            RollTestDataModel._toJson(
                {
                    name: "Arremessar",
                    primary_attribute: CharacteristicType.ATTRIBUTES.STRENGTH.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.PERCEPTION.id,
                    ability: CharacteristicType.SKILLS.ATHLETICS.id,
                    difficulty: 6
                }
            ),
        ],
    ),
    EnhancementEffectField._toJson(
        '22',
        'Fulminante',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['19', '20'],
        [
            { key: CharacteristicType.BONUS.OFENSIVE_MELEE, value: 1, typeOfValue: EffectChangeValueType.HALF_ENHANCEMENT_LEVEL_PLUS_FIXED },
        ]
    ),
    EnhancementEffectField._toJson(
        '23',
        'Hit Kill',
        4,
        EnhancementOverload.ONE_FIXED,
        EnhancementDuration.USE,
        ['21', '22'],
    ),
    EnhancementEffectField._toJson(
        '24',
        'Destroçar',
        5,
        EnhancementOverload.ONE_FIXED,
        EnhancementDuration.SCENE,
        ['23']
    )
];

export const brutalityEnhancement = {
    id: '3',
    name: 'Brutalidade',
    value: 'brutalidade',
    icon: `${ICONS_PATH}/brutality.svg`,
    effects: brutalityEffects
};