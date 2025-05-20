import { ICONS_PATH } from "../../constants.mjs";
import { RollTestDataModel } from "../../data/roll-test-data-model.mjs";
import { CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { EffectChangeValueType, EnhancementDuration, EnhancementOverload } from "../../enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../field/enhancement-field.mjs";

const enhancementID = '2';

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
        [],
        [],
        [
            RollTestDataModel._toJson(
                {
                    name: "Perceber Camuflagem",
                    primary_attribute: CharacteristicType.ATTRIBUTES.INTELLIGENCE.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.PERCEPTION.id,
                    ability: CharacteristicType.SKILLS.INVESTIGATION.id,
                    difficulty: 6,
                }
            ),
            RollTestDataModel._toJson(
                {
                    name: "(Rede) Perceber Camuflagem",
                    primary_attribute: CharacteristicType.VIRTUES.CONSCIOUSNESS.id,
                    secondary_attribute: CharacteristicType.ENHANCEMENT.id,
                    special_secondary: enhancementID,
                    difficulty: 6,
                }
            ),
        ]
    ),
    EnhancementEffectField._toJson(
        '11',
        'Simulação',
        2,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.PASSIVE,
        ['9', '10']
    ),
    EnhancementEffectField._toJson(
        '12',
        'Debug',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.USE,
        ['11'],
        [],
        [
            RollTestDataModel._toJson(
                {
                    name: "Identificar",
                    primary_attribute: CharacteristicType.ATTRIBUTES.INTELLIGENCE.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.PERCEPTION.id,
                    ability: CharacteristicType.SKILLS.INVESTIGATION.id,
                    difficulty: 7
                }
            ),
        ]
    ),
    EnhancementEffectField._toJson(
        '13',
        'Proxy',
        3,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['11'],
        [],
        [
            RollTestDataModel._toJson(
                {
                    name: "Hackear Sistema",
                    primary_attribute: CharacteristicType.ATTRIBUTES.INTELLIGENCE.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.PERCEPTION.id,
                    ability: CharacteristicType.SKILLS.HACKING.id,
                    difficulty: 7
                }
            ),
            RollTestDataModel._toJson(
                {
                    name: "Hackear Aprimoramento",
                    primary_attribute: CharacteristicType.ATTRIBUTES.INTELLIGENCE.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.PERCEPTION.id,
                    ability: CharacteristicType.SKILLS.HACKING.id,
                    difficulty: 7
                }
            ),
        ]
    ),
    EnhancementEffectField._toJson(
        '14',
        'Ponto de Acesso',
        4,
        EnhancementOverload.ONE_TESTED,
        EnhancementDuration.SCENE,
        ['12', '13'],
        [],
        [
            RollTestDataModel._toJson(
                {
                    name: "Compartilhar Sentidos",
                    primary_attribute: CharacteristicType.ATTRIBUTES.INTELLIGENCE.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.PERCEPTION.id,
                    ability: CharacteristicType.SKILLS.HACKING.id,
                    difficulty: 7
                }
            ),
            RollTestDataModel._toJson(
                {
                    name: "Ilusão",
                    primary_attribute: CharacteristicType.ATTRIBUTES.INTELLIGENCE.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.PERCEPTION.id,
                    ability: CharacteristicType.SKILLS.HACKING.id,
                    difficulty: 8
                }
            ),
        ]
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
                {
                    name: "Simular Alvo",
                    primary_attribute: CharacteristicType.ATTRIBUTES.INTELLIGENCE.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.PERCEPTION.id,
                    ability: CharacteristicType.SKILLS.INVESTIGATION.id,
                    difficulty: 6
                }
            ),
        ]
    ),
    EnhancementEffectField._toJson(
        '16',
        'Onipresença',
        5,
        EnhancementOverload.ONE_FIXED_ONE_TEST,
        EnhancementDuration.TIME,
        ['14', '15'],
        [],
        [
            RollTestDataModel._toJson(
                {
                    name: "Compreensão Total",
                    primary_attribute: CharacteristicType.ATTRIBUTES.INTELLIGENCE.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.PERCEPTION.id,
                    ability: CharacteristicType.SKILLS.INVESTIGATION.id,
                    difficulty: 7
                }
            ),
        ]
    ),
    EnhancementEffectField._toJson(
        '17',
        'Dedução e Indução Mental',
        5,
        EnhancementOverload.ONE_FIXED_ONE_TEST,
        EnhancementDuration.TIME,
        ['14', '15'],
        [],
        [
            RollTestDataModel._toJson(
                {
                    name: "Invadir Memória",
                    primary_attribute: CharacteristicType.ATTRIBUTES.INTELLIGENCE.id,
                    secondary_attribute: CharacteristicType.ATTRIBUTES.PERCEPTION.id,
                    ability: CharacteristicType.SKILLS.HACKING.id,
                    difficulty: 7
                }
            ),
        ]
    )
];

export const assimilationEnhancement = {
    id: enhancementID,
    name: 'Assimilação',
    value: 'assimilacao',
    icon: `${ICONS_PATH}/assimilation.svg`,
    effects: assimilationEffects
};