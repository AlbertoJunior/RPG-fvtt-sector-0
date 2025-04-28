import { FlagsUtils } from "../../module/utils/flags-utils.mjs";

export default function gameFunc(func) {
    const funcMap = {
        isGm: () => game.user.isGM,
        isOwner: () => game.user.isOwner,
        inDarkMode: () => FlagsUtils.getGameUserFlag(game.user, 'darkMode'),
        isCompactedSheet: () => FlagsUtils.getGameUserFlag(game.user, 'isCompactedSheet')
    };

    return funcMap[func]?.() || false;
}