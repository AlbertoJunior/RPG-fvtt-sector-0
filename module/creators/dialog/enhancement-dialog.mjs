import { sendEffectToChat } from "../../base/sheet/actor/methods/enhancement-methods.mjs";
import { EnhancementDuration } from "../../enums/enhancement-enums.mjs";
import { EnhancementRepository } from "../../repository/enhancement-repository.mjs";
import { EnhancementInfoParser } from "../../../scripts/parser/enhancement-info.mjs";
import { DialogUtils } from "../../utils/dialog-utils.mjs";
import { localize } from "../../../scripts/utils/utils.mjs";
import { OnEventType } from "../../enums/on-event-type.mjs";
import { RollAttribute } from "../../core/rolls/attribute-roll.mjs";
import { DefaultActions } from "../../utils/default-actions.mjs";

export class EnhancementDialog {
    static async _open(enhancementEffect, actor) {
        const enhancementFamily = EnhancementRepository._getEnhancementFamilyByEffectId(enhancementEffect.id);
        const content = await this.#mountContent(enhancementEffect, enhancementFamily);

        const buttons = {
            cancel: {
                label: localize("Chat"),
                callback: (html) => {
                    sendEffectToChat(enhancementEffect, actor);
                }
            }
        };

        const canActive = actor != undefined && enhancementEffect.duration !== EnhancementDuration.PASSIVE;
        if (canActive) {
            buttons.confirm = {
                label: localize("Ativar"),
                callback: (html) => {

                }
            }
        }

        new Dialog(
            {
                title: `${enhancementEffect.name}`,
                content: content,
                buttons: buttons,
                render: (html) => {
                    DialogUtils.presetDialogRender(html);
                    $(html).find(`[data-action="${OnEventType.ROLL}"]`).click(EnhancementDialog.#onRollEvent.bind(this, actor, enhancementEffect));
                }
            },
            {
                width: 480,
            }
        ).render(true);
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

    static async #onRollEvent(actor, enhancementEffect, event) {
        const rollId = event.currentTarget.dataset.itemId;
        const possibleTests = enhancementEffect.possible_tests || [];
        const rollTest = possibleTests.find(test => test.id == rollId);
        if (!rollTest) {
            return;
        }

        const resultRoll = await RollAttribute.rollByRollableTests(actor, rollTest);
        const rollMessage = `${enhancementEffect.name}: ${rollTest.name}`;
        DefaultActions.sendRollOnChat(actor, resultRoll, rollTest.difficulty, rollMessage);
    }
}