import { EquipmentInfoParser } from "../../module/core/equipment/equipment-info.mjs";
import { CharacteristicType } from "../../module/enums/characteristic-enums.mjs";
import { EnhancementRepository } from "../../module/repository/enhancement-repository.mjs";
import { keyJsonToKeyLang } from "../utils/utils.mjs";

const parseables = {
    'roll-enhancement-formule': (values) => {
        const [enhancementId, val1, val2, val3 = ''] = values;

        const enhancement = EnhancementRepository._getEnhancementById(enhancementId);

        const replaceIfEnhancement = (val) => {
            if (val == CharacteristicType.ENHANCEMENT.id) {
                return enhancement.name;
            } else if (val) {
                return game.i18n.localize(keyJsonToKeyLang(val));
            } else {
                return '';
            }
        };

        const primary = replaceIfEnhancement(val1);
        const secondary = replaceIfEnhancement(val2);
        const base = `(${primary} + ${secondary})/2`;
        return val3 ? `${base} + ${replaceIfEnhancement(val3)}` : base;
    },
    'effect-on-status': (value) => {
        const effect = value[0];
        const origin = effect.origin;
        const name = effect.name;
        return origin ? `${origin}: ${name}` : name;
    },
    'item-damage-type': (value) => EquipmentInfoParser.parseDamageType(value),
}

export default function parse(op, ...params) {
    params.pop();
    return parseables[op](Object.values(params));
}