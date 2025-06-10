import { SYSTEM_ID } from "../constants.mjs";

export class FlagsUtils {
    static getActorFlag(actor, flag, defaultValue) {
        return actor.getFlag(SYSTEM_ID, flag) || defaultValue;
    }

    static async setItemFlag(item, flag, value) {
        await item.setFlag(SYSTEM_ID, flag, value);
    }

    static getItemFlag(item, flag, defaultValue) {
        const flagValue = item.getFlag(SYSTEM_ID, flag);
        if (flagValue == undefined || flagValue == null) {
            return defaultValue;
        } else {
            return flagValue
        }
    }

    static getMacroFlag(macro, flag) {
        return macro.flags[SYSTEM_ID]?.[flag];
    }
}