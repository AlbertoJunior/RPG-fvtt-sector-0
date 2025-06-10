import { SystemFlags } from "../../module/enums/flags-enums.mjs";
import { FlagsUtils } from "../../module/utils/flags-utils.mjs";
import { localize } from "../utils/utils.mjs";

const parsedModes = [];

function rollModes() {
    if (parsedModes.length > 0) {
        return parsedModes;
    }

    const mappedLabel = {
        [CONST.DICE_ROLL_MODES.BLIND]: localize('Rolagem_GM_Oculta'),
        [CONST.DICE_ROLL_MODES.PRIVATE]: localize('Rolagem_Privada_GM'),
        [CONST.DICE_ROLL_MODES.PUBLIC]: localize('Rolagem_Publica'),
        [CONST.DICE_ROLL_MODES.SELF]: localize('Rolagem_Pessoal'),
    }

    const mappedModes = Object.values(CONST.DICE_ROLL_MODES).map(roll => {
        return {
            value: roll,
            label: mappedLabel[roll] || 'erro'
        }
    });

    parsedModes.push(...mappedModes);
    return parsedModes;
}

export default function gameFunc(func) {
    const funcMap = {
        isGm: () => game.user.isGM,
        isOwner: () => game.user.isOwner,
        inDarkMode: () => FlagsUtils.getItemFlag(game.user, SystemFlags.MODE.DARK),
        isCompactedSheet: () => FlagsUtils.getItemFlag(game.user, SystemFlags.MODE.COMPACT),
        'players-roll-mode': () => {
            return rollModes().filter(mode => mode.value != CONST.DICE_ROLL_MODES.SELF);
        },
        'gm-roll-mode': () => {
            return rollModes().filter(mode => mode.value == CONST.DICE_ROLL_MODES.SELF);
        }
    };

    return funcMap[func]?.() || false;
}