import { sendEffectToChat } from "../../base/sheet/actor/methods/enhancement-methods.mjs";
import { EnhancementDuration } from "../../enums/enhancement-enums.mjs";
import { EnhancementRepository } from "../../repository/enhancement-repository.mjs";
import { EnhancementInfoParser } from "../../../scripts/parser/enhancement-info.mjs";

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
            overload: EnhancementInfoParser.overloadValueToString(enhancementEffect.overload),
            duration: EnhancementInfoParser.durationValueToString(enhancementEffect.duration),
            family: enhancementFamily.name,
        };
        return await renderTemplate("systems/setor0OSubmundo/templates/enhancement/enhancement-dialog.hbs", data);
    }
}