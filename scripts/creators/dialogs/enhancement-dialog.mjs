import { sendEffectToChat } from "../../../module/base/sheet/enhancement-methods.mjs";
import { EnhancementDuration } from "../../../module/enums/enhancement-enums.mjs";
import { EnhancementInfoParser } from "../../parser/enhancement-info.mjs";
import { EnhancementRepository } from "../../repository/enhancement-repository.mjs";

export class EnhancementDialog {
    static async _open(enhancementEffect, actor) {
        const enhancementFamily = EnhancementRepository._getEnhancementFamilyByEffectId(enhancementEffect.id);
        const content = await this.#mountContent(enhancementEffect, enhancementFamily);

        const buttons = {
            cancel: {
                label: "Chat",
                callback: (html) => {
                    sendEffectToChat(enhancementEffect, actor);
                }
            }
        };

        const canActive = actor != undefined && enhancementEffect.duration !== EnhancementDuration.PASSIVE;
        if (canActive) {
            buttons.confirm = {
                label: "Ativar",
                callback: (html) => {

                }
            }
        }

        new Dialog({
            title: `${enhancementEffect.name}`,
            content: content,
            buttons: buttons
        }).render(true);
    }

    static async #mountContent(enhancementEffect, enhancementFamily) {
        const data = {
            ...enhancementEffect,
            overload: EnhancementInfoParser._overloadValueToString(enhancementEffect.overload),
            duration: EnhancementInfoParser._durationValueToString(enhancementEffect.duration),
            family: enhancementFamily.name,
        };
        return await renderTemplate("systems/setor0OSubmundo/templates/enhancement/enhancement-dialog.hbs", data);
    }
}