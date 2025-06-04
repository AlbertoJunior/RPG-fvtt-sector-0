import { EnhancementDuration } from "../../enums/enhancement-enums.mjs";
import { EnhancementRepository } from "../../repository/enhancement-repository.mjs";
import { EnhancementInfoParser } from "../../core/enhancement/enhancement-info.mjs";
import { DialogUtils } from "../../utils/dialog-utils.mjs";
import { localize } from "../../../scripts/utils/utils.mjs";
import { OnEventType } from "../../enums/on-event-type.mjs";
import { RollAttribute } from "../../core/rolls/attribute-roll.mjs";
import { DefaultActions } from "../../utils/default-actions.mjs";
import { CustomRoll } from "../../core/rolls/custom-roll.mjs";
import { CreateFormDialog } from "./create-dialog.mjs";
import { ChatCreator } from "../../utils/chat-creator.mjs";
import { EnhancementMessageCreator } from "../message/enhancement-message.mjs";

export class EnhancementDialog {
    static async _open(enhancementEffect, actor, onConfirm) {
        const enhancementFamily = EnhancementRepository._getEnhancementFamilyByEffectId(enhancementEffect.id);
        const content = await this.#mountContent(enhancementEffect, enhancementFamily);

        const buttons = {
            cancel: {
                label: localize("Chat"),
                callback: (html) => {
                    this.#sendEffectToChat(enhancementEffect, actor);
                }
            }
        };

        const canActive = actor != undefined && enhancementEffect.duration !== EnhancementDuration.PASSIVE && typeof onConfirm === 'function';
        if (canActive) {
            buttons.confirm = {
                label: localize("Ativar"),
                callback: (html) => {
                    onConfirm();
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
            familyId: enhancementFamily.id,
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

        CreateFormDialog.open(
            localize("Modificadores"),
            "rolls/modifiers",
            {
                presetForm: {
                    canBeHalf: true,
                    canBeSpecialist: true,
                    defaultDifficulty: rollTest.difficulty,
                    defaultCritic: rollTest.critic,
                },
                onConfirm: async (data) => {
                    const rollMessage = `${enhancementEffect.name}: ${rollTest.name}`;
                    const difficulty = Number(data.difficulty);
                    const critic = Number(data.critic);
                    const bonus = Number(data.bonus);
                    const automatic = Number(data.automatic);
                    const isHalf = Boolean(data.half);
                    const isSpecialist = Boolean(data.specialist);
                    const mode = data.chatSelect;

                    if (rollTest.ability) {
                        rollTest.critic = critic;
                        rollTest.difficulty = difficulty;
                        rollTest.bonus = bonus;
                        rollTest.automatic = automatic;
                        rollTest.specialist = isSpecialist;

                        const resultRoll = await RollAttribute.rollByRollableTests(actor, rollTest);
                        await DefaultActions.sendRollOnChat(actor, resultRoll, difficulty, critic, rollMessage, mode);
                    } else {
                        const inputParams = {
                            primary: rollTest.primary_attribute,
                            secondary: rollTest.secondary_attribute,
                            tertiary: rollTest.tertiary_attribute,
                            special_primary: rollTest.special_primary,
                            special_secondary: rollTest.special_secondary,
                            special_tertiary: rollTest.special_tertiary,
                            half: isHalf,
                            specialist: isSpecialist,
                            bonus: bonus,
                            automatic: automatic,
                            difficulty: difficulty,
                            critic: critic,
                        }

                        const resultRoll = await CustomRoll.discoverAndRoll(actor, inputParams);
                        await DefaultActions.processCustomRoll(actor, resultRoll, inputParams, rollMessage, mode);
                    }
                }
            }
        );
    }

    static async #sendEffectToChat(effect, actor) {
        const message = await EnhancementMessageCreator.mountContentInfo(effect);
        ChatCreator._sendToChat(actor, message);
    }
}