import { ICONS_PATH } from "../../constants.mjs";
import { EffectChangeValueType, EnhancementDuration, EnhancementOverload } from "../../enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../field/actor-enhancement-field.mjs";

const brutalityEffects = [
    EnhancementEffectField._toJson('18', 'Força Brutal', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
    EnhancementEffectField._toJson('19', 'Fanático', 2, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['18']),
    EnhancementEffectField._toJson('20', 'Força Esmagadora', 2, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['18']),
    EnhancementEffectField._toJson('21', 'Canhão', 3, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['19', '20']),
    EnhancementEffectField._toJson('22', 'Fulminante', 3, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['19', '20']),
    EnhancementEffectField._toJson('23', 'Hit Kill', 4, EnhancementOverload.NONE, EnhancementDuration.USE, ['21', '22']),
    EnhancementEffectField._toJson('24', 'Destroçar', 5, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['23'])
];

export const brutalityEnhancement = {
    id: '3',
    name: 'Brutalidade',
    value: 'brutalidade',
    icon: `${ICONS_PATH}/brutality.svg`,
    effects: brutalityEffects
};