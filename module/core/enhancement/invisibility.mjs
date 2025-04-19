import { ICONS_PATH } from "../../constants.mjs";
import { EffectChangeValueType, EnhancementDuration, EnhancementOverload } from "../../enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../field/actor-enhancement-field.mjs";

const invisibilityEffects = [
    EnhancementEffectField._toJson('33', 'Esconder', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
    EnhancementEffectField._toJson('34', 'Supressão de Ruídos', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
    EnhancementEffectField._toJson('35', 'Silenciar', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
    EnhancementEffectField._toJson('36', 'Camuflagem', 2, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['33', '34', '35']),
    EnhancementEffectField._toJson('37', 'Fantasma', 3, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['36']),
    EnhancementEffectField._toJson('38', 'Um na multidão', 3, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['36']),
    EnhancementEffectField._toJson('39', 'Desaparecer', 4, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['37', '38']),
    EnhancementEffectField._toJson('40', 'Incógnito', 5, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['39'])
];

export const invisibilityEnhancement = {
    id: '5',
    name: 'Invisibilidade',
    value: 'invisibilidade',
    icon: `${ICONS_PATH}/invisibility.svg`,
    effects: invisibilityEffects
};