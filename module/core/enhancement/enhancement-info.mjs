import { EnhancementDuration, EnhancementOverload } from "../../enums/enhancement-enums.mjs";
import { localize } from "../../../scripts/utils/utils.mjs";

export class EnhancementInfoParser {

    static durationValueToString(value) {
        const mapDuration = {
            [EnhancementDuration.PASSIVE]: `${localize('Passivo')}`,
            [EnhancementDuration.SCENE]: `${localize('Cena')}`,
            [EnhancementDuration.USE]: `${localize('Uso')}`,
            [EnhancementDuration.TIME]: `${localize('Tempo')}`,
        }
        return mapDuration[value] || `<${localize('Erro')}>`;
    }

    static overloadValueToString(value) {
        const mapOverload = {
            [EnhancementOverload.NONE]: `${localize('Nenhum')}`,
            [EnhancementOverload.ONE_TESTED]: '1',
            [EnhancementOverload.ONE_FIXED]: `1 ${localize('Automatico')}`,
            [EnhancementOverload.ONE_FIXED_ONE_TEST]: `1 ${localize('Automatico')} + 1`,
            [EnhancementOverload.TWO_TESTED]: '2',
            [EnhancementOverload.TWO_FIXED]: `2 ${localize('Automatico')}`,
        }
        return mapOverload[value] || `<${localize('Erro')}>`;
    }
}