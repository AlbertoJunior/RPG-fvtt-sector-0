import { SystemFlags } from "../../module/enums/flags-enums.mjs";
import { FlagsUtils } from "../../module/utils/flags-utils.mjs";

export default function gameFunc(func) {
    const funcMap = {
        isGm: () => game.user.isGM,
        isOwner: () => game.user.isOwner,
        inDarkMode: () => FlagsUtils.getItemFlag(game.user, SystemFlags.MODE.DARK),
        isCompactedSheet: () => FlagsUtils.getItemFlag(game.user, SystemFlags.MODE.COMPACT)
    };

    return funcMap[func]?.() || false;
}