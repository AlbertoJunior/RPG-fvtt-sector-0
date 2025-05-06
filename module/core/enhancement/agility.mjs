import { ICONS_PATH } from "../../constants.mjs";
import { CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { EffectChangeValueType, EnhancementDuration, EnhancementOverload } from "../../enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../field/actor-enhancement-field.mjs";

const agilityEffects = [
    EnhancementEffectField._toJson(
        '1',
        'Maestria',
        1,
        EnhancementOverload.NONE,
        EnhancementDuration.PASSIVE,
        [],
        [
            { key: CharacteristicType.BONUS.INITIATIVE, value: 1, typeOfValue: EffectChangeValueType.HALF_ENHANCEMENT_LEVEL_PLUS_FIXED },
        ]
    ),
    EnhancementEffectField._toJson(
        '2',
        'Reflexos Rápidos',
        1,
        EnhancementOverload.NONE,
        EnhancementDuration.PASSIVE,
        [],
        [
            { key: CharacteristicType.BONUS.INITIATIVE, value: 1, typeOfValue: EffectChangeValueType.HALF_ENHANCEMENT_LEVEL_PLUS_FIXED },
        ]
    ),
    EnhancementEffectField._toJson(
        '3',
        'Agilidade',
        2,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['1', '2'],
        [
            { key: CharacteristicType.BONUS.ATTRIBUTES.DEXTERITY, value: 0, typeOfValue: EffectChangeValueType.ENHANCEMENT_LEVEL },
        ]
    ),
    EnhancementEffectField._toJson(
        '4',
        'Disparada',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.USE,
        ['3']
    ),
    EnhancementEffectField._toJson(
        '5',
        'Primeira Forma Defensiva',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['3'],
        [
            { key: CharacteristicType.BONUS.DEFENSIVE_FACTOR, value: 1 / 2, typeOfValue: EffectChangeValueType.FIXED },
        ]
    ),
    EnhancementEffectField._toJson(
        '6',
        'Ataque Relâmpago',
        4,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.USE,
        ['4', '5']
    ),
    EnhancementEffectField._toJson(
        '7',
        'Segunda Forma Defensiva',
        4,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['4', '5'],
        [
            { key: CharacteristicType.BONUS.DEFENSIVE_FACTOR, value: 1 / 2, typeOfValue: EffectChangeValueType.FIXED },
        ]
    ),
    EnhancementEffectField._toJson(
        '8',
        'Fração de Segundo',
        5,
        EnhancementOverload.TWO_FIXED,
        EnhancementDuration.USE,
        ['6', '7']
    )
];

export const agilityEnhancement = {
    id: '1',
    name: 'Aceleração',
    value: 'aceleracao',
    icon: `${ICONS_PATH}/agility.svg`,
    effects: agilityEffects
};