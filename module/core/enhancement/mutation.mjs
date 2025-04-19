import { ICONS_PATH } from "../../constants.mjs";
import { EffectChangeValueType, EnhancementDuration, EnhancementOverload } from "../../enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../field/actor-enhancement-field.mjs";

const mutationEffects = [
    EnhancementEffectField._toJson('41', 'Arma Corporal', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
    EnhancementEffectField._toJson('42', 'Fundir', 1, EnhancementOverload.NONE, EnhancementDuration.SCENE, []),
    EnhancementEffectField._toJson('43', 'Regeneração', 2, EnhancementOverload.NONE, EnhancementDuration.USE, ['42']),
    EnhancementEffectField._toJson('44', 'Resistência à toxinas', 2, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['41', '42']),
    EnhancementEffectField._toJson('45', 'Anatomia', 3, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['44', '43']),
    EnhancementEffectField._toJson('46', 'Peçonhento', 3, EnhancementOverload.NONE, EnhancementDuration.USE, ['44']),
    EnhancementEffectField._toJson('47', 'Incorpóreo', 4, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['45', '46']),
    EnhancementEffectField._toJson('48', 'Simbiose', 4, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['45', '46']),
    EnhancementEffectField._toJson('49', 'Imortalidade', 5, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['47', '48'])
];

export const mutationEnhancement = {
    id: '6',
    name: 'Mutação',
    value: 'mutacao',
    icon: `${ICONS_PATH}/mutation.svg`,
    effects: mutationEffects
};