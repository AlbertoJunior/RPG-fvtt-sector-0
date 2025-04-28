import { normalizeString } from "../../../scripts/utils/utils.mjs";
import { NotificationsUtils } from "../../creators/message/notifications.mjs";
import { DefaultActions } from "../../utils/default-actions.mjs";
import { FlagsUtils } from "../../utils/flags-utils.mjs";
import { openBagMacroData } from "./default/open-bag.mjs";
import { openShortcutMacroData } from "./default/open-shortcut.mjs";
import { rollOverloadMacroData } from "./default/roll-overload.mjs";
import { cleanMacroHotbarUserMacroData } from "./gm/clean-macro-hotbar.mjs";
import { resetUserFlagsMacroData } from "./gm/reset-user-flags.mjs";

export class MacroUtils {
    static getDefaultMacroUsers() {
        return [
            openBagMacroData,
            openShortcutMacroData,
            rollOverloadMacroData
        ];
    }

    static getDefaultGmMacro() {
        return [
            cleanMacroHotbarUserMacroData,
            resetUserFlagsMacroData
        ];
    }

    static async createMacro({ name, command, img, toHotbar = true } = {}) {
        let macro = game.macros.find(m => normalizeString(m.name) === normalizeString(name) && normalizeString(m.command) === normalizeString(command));
        if (!macro) {
            macro = await Macro.create({
                name,
                type: "script",
                command,
                img,
            });

            if (toHotbar) {
                await game.user.assignHotbarMacro(macro);
                const slot = Object.values(game.user.hotbar).length;
                NotificationsUtils._info(`Macro "${name}" adicionada ao slot [${slot}].`);
            } else {
                NotificationsUtils._info(`Macro "${name}" criada.`);
            }
        } else {
            NotificationsUtils._info(`Você já possui essa Macro.`);
        }

        return macro;
    }

    static isTheSameMacro(macroA, macroB) {
        const sourceIdA = FlagsUtils.getMacroFlag(macroA, 'sourceId');
        const sourceIdB = FlagsUtils.getMacroFlag(macroB, 'sourceId');

        const sameName = normalizeString(macroA.name) === normalizeString(macroB.name);
        const sameCommand = normalizeString(macroA.command) === normalizeString(macroB.command);
        const sameSourceId = sourceIdA === sourceIdB;

        return sameName && sameCommand && sameSourceId;
    }

    static async exposeMethodsForMacros() {
        globalThis.MacroMethods = {
            overload: async (actor) => {
                await DefaultActions.processOverloadRoll(actor);
            }
        }
    }
}