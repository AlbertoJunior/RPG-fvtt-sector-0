import { getObject, normalizeString } from "../../../scripts/utils/utils.mjs";
import { shortcutCustomRoll } from "../../base/sheet/actor/methods/shortcut-methods.mjs";
import { rollByItemAndRollId } from "../../base/sheet/equipment/methods/equipment-item-roll-methods.mjs";
import { SYSTEM_ID } from "../../constants.mjs";
import { NotificationsUtils } from "../../creators/message/notifications.mjs";
import { CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { EquipmentCharacteristicType } from "../../enums/equipment-enums.mjs";
import { DefaultActions } from "../../utils/default-actions.mjs";
import { FlagsUtils } from "../../utils/flags-utils.mjs";
import { ActorEquipmentUtils } from "../actor/actor-equipment.mjs";
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

    static async createMacro({ name, command, img, toHotbar = true, flags } = {}) {
        let macro = game.macros.find(m => normalizeString(m.name) === normalizeString(name) && normalizeString(m.command) === normalizeString(command));
        if (!macro) {
            macro = await Macro.create({
                flags: {
                    [SYSTEM_ID]: {
                        ...flags
                    }
                },
                name,
                type: "script",
                command,
                img,
            });

            if (toHotbar) {
                await game.user.assignHotbarMacro(macro);
                const slot = Object.values(game.user.hotbar).length;
                NotificationsUtils._info(`Macro "${name}" adicionada ao espaço [${slot}].`);
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
            },
            customs: {
                rollable: async (params) => {
                    const { actor, id } = params;
                    if (!actor || !id) {
                        console.log("Elementos inválidos")
                        return;
                    }

                    if (!actor?.sheet.canRollOrEdit) {
                        NotificationsUtils._warning('Você não tem permissão para executar isso com esse personagem.');
                        return
                    }

                    const item = ActorEquipmentUtils.getActorEquipments(actor).find(item => {
                        const tests = getObject(item, EquipmentCharacteristicType.POSSIBLE_TESTS) || [];
                        return tests.some(test => test.id === id);
                    });

                    if (item) {
                        if (getObject(item, EquipmentCharacteristicType.EQUIPPED) || false) {
                            await rollByItemAndRollId(item, id);
                        } else {
                            NotificationsUtils._info(`O Item [${item.name}] precisa estar equipado`);
                        }
                        return;
                    }

                    const actorTestShortcut = getObject(actor, CharacteristicType.SHORTCUTS).find(test => test.id == id);
                    if (actorTestShortcut) {
                        await shortcutCustomRoll(actor, id);
                        return;
                    }

                    NotificationsUtils._warning('Erro ao executar o teste');
                }
            }
        }
    }
}