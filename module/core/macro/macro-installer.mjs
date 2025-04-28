import { SYSTEM_ID } from "../../constants.mjs";
import { NotificationsUtils } from "../../creators/message/notifications.mjs";
import { FlagsUtils } from "../../utils/flags-utils.mjs";
import { MacroUtils } from "./macro-utils.mjs";

export class MacroInstaller {
    static async installDefaultMacrosOnUser() {
        await this.installList(MacroUtils.getDefaultMacroUsers());
    }

    static async installDefaultMacrosOnGm() {
        await this.installList(MacroUtils.getDefaultGmMacro());
    }

    static async installList(list) {
        for (const macro of list) {
            await this.installMacroOnce(macro.name, FlagsUtils.getMacroFlag(macro, 'sourceId'));
        }
    }

    static async installMacroOnce(macroName, sourceId) {
        const user = game.user;
        const installedMacros = FlagsUtils.getGameUserFlag(user, 'macroInstalled') || [];
        const macroKey = `${macroName}_${sourceId}`;

        if (installedMacros.includes(macroKey)) {
            return;
        }

        const packId = `${SYSTEM_ID}.macros`;
        const pack = game.packs.get(packId);
        if (!pack) {
            console.error(`Compêndio ${packId} não encontrado.`);
            return;
        }

        const macros = await pack.getDocuments();
        const macro = macros.find(m => m.name === macroName && FlagsUtils.getMacroFlag(m, 'sourceId') && sourceId);
        if (!macro) {
            console.warn(`Macro "${macroName}" não encontrada no compêndio ${packId}.`);
            return;
        }

        let worldMacro = game.macros.find(macroB => MacroUtils.isTheSameMacro(macro, macroB));
        if (!worldMacro) {
            worldMacro = await Macro.create(macro.toObject());
        }

        await user.assignHotbarMacro(worldMacro);
        NotificationsUtils._info(`Macro "${macroName}" adicionada à sua hotbar.`);

        await FlagsUtils.setGameUserFlag(user, 'macroInstalled', [...installedMacros, macroKey]);
    }
}