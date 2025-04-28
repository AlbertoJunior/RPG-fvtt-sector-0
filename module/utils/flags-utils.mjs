import { SYSTEM_ID } from "../constants.mjs";

export class FlagsUtils {
    static async setGameUserFlag(user, flag, value) {
        await user.setFlag(SYSTEM_ID, flag, value)
    }

    static getGameUserFlag(user, flag) {
        return user.getFlag(SYSTEM_ID, flag);
    }

    static async setActorFlag(actor, flag, value) {
        await actor.setFlag(SYSTEM_ID, flag, value);
    }

    static getActorFlag(actor, flag) {
        return actor.getFlag(SYSTEM_ID, flag);
    }

    static async setItemFlag(item, flag, value) {
        await item.setFlag(SYSTEM_ID, flag, value);
    }

    static getItemFlag(item, flag) {
        return item.getFlag(SYSTEM_ID, flag);
    }

    static getMacroFlag(macro, flag) {
        return macro.flags[SYSTEM_ID]?.[flag];
    }
}