import { ICONS_PATH } from "../../constants.mjs";
import { RollTestDataModel } from "../../data/roll-test-data-model.mjs";
import { CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { EffectChangeValueType, EnhancementDuration, EnhancementOverload } from "../../enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../field/actor-enhancement-field.mjs";

const assimilationEffects = [
    EnhancementEffectField._toJson(
        '9',
        'Aguçar Sentidos',
        1,
        EnhancementOverload.NONE,
        EnhancementDuration.SCENE,
        [],
        [
            { key: CharacteristicType.BONUS.ATTRIBUTES.PERCEPTION, value: 0, typeOfValue: EffectChangeValueType.ENHANCEMENT_LEVEL },
        ]
    ),
    EnhancementEffectField._toJson(
        '10',
        'Hiper-Visão Cibernética',
        1,
        EnhancementOverload.NONE,
        EnhancementDuration.SCENE,
        []
    ),
    EnhancementEffectField._toJson(
        '11',
        'Simulação',
        2,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['9', '10']
    ),
    EnhancementEffectField._toJson(
        '12',
        'Debug',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.USE,
        ['11']
    ),
    EnhancementEffectField._toJson(
        '13',
        'Proxy',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['11']
    ),
    EnhancementEffectField._toJson(
        '14',
        'Ponto de Acesso',
        4,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['12', '13']
    ),
    EnhancementEffectField._toJson(
        '15',
        'Criar Gatilhos',
        4,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['12', '13'],
        [
            { key: CharacteristicType.BONUS.ATTRIBUTES.INTELLIGENCE, value: 0, typeOfValue: EffectChangeValueType.ENHANCEMENT_LEVEL },
        ],
        [
            RollTestDataModel._toJson(
                { name: "Teste", primary_attribute: "inteligencia", secondary_attribute: "percepcao", ability: "investigacao", difficulty: 6 }
            ),
        ]
    ),
    EnhancementEffectField._toJson(
        '16',
        'Onipresença',
        5,
        EnhancementOverload.ONE_FIXED_ONE_TEST,
        EnhancementDuration.TIME,
        ['14', '15']
    ),
    EnhancementEffectField._toJson(
        '17',
        'Dedução e Indução Mental',
        5,
        EnhancementOverload.ONE_FIXED_ONE_TEST,
        EnhancementDuration.SCENE,
        ['14', '15']
    )
];

export const assimilationEnhancement = {
    id: '2',
    name: 'Assimilação',
    value: 'assimilacao',
    icon: `${ICONS_PATH}/assimilation.svg`,
    effects: assimilationEffects
};