import { RollAttribute } from "../../core/rolls/attribute-roll.mjs";
import { keyJsonToKeyLang, localize } from "../../../scripts/utils/utils.mjs";
import { DefaultActions } from "../../utils/default-actions.mjs";
import { DialogUtils } from "../../utils/dialog-utils.mjs";
import { AttributeRepository } from "../../repository/attribute-repository.mjs";
import { AbilityRepository } from "../../repository/ability-repository.mjs";
import { VirtuesRepository } from "../../repository/virtues-repository.mjs";
import { OnEventType } from "../../enums/on-event-type.mjs";
import { RollVirtue } from "../../core/rolls/virtue-roll.mjs";

export class ActorRollDialog {
    static async _open(actor) {
        const content = await this.#mountContent();

        let currentPageDialog = 0;
        let pages = [];

        new Dialog({
            title: localize("Realizar_Teste"),
            content,
            buttons: {
                cancel: {
                    label: localize("Cancelar")
                },
                confirm: {
                    label: localize("Rolar"),
                    callback: async (html) => {
                        switch (currentPageDialog) {
                            case 0: {
                                await this.#confirmPage1($(pages[currentPageDialog]), actor);
                                return;
                            };
                            case 1: {
                                await this.#confirmPage2($(pages[currentPageDialog]), actor);
                                return;
                            };
                        }
                    }
                }
            },
            render: (html) => {
                const windowApp = DialogUtils.presetDialogRender(html);
                const buttons = html.find(`[data-action="${OnEventType.CHECK}"]`);
                pages = html.find(`[data-characteristic="page"]`);
                this.#changePage(currentPageDialog, pages, buttons);

                buttons.on("click", (event) => {
                    currentPageDialog = Number(event.currentTarget.dataset.item);
                    this.#changePage(currentPageDialog, pages, buttons);
                    windowApp.style.height = 'auto';
                });
            },
            default: 'confirm',
        }).render(true);
    }

    static async #mountContent() {
        const attributesOptions = AttributeRepository._getItems()
            .map(attr => {
                return {
                    id: attr.id,
                    label: game.i18n.localize(attr.label),
                }
            });

        const abilitiesOptions = AbilityRepository._getItems()
            .map(attr => {
                return {
                    id: attr.id,
                    label: game.i18n.localize(attr.label),
                }
            });

        const virtueOptions = VirtuesRepository._getItems();

        const data = {
            attributes: attributesOptions,
            abilities: abilitiesOptions,
            virtues: virtueOptions,
        }
        return await renderTemplate("systems/setor0OSubmundo/templates/rolls/default-roll.hbs", data);
    }

    static #changePage(page, pages, buttons) {
        pages.each((index, htmlPage) => {
            const isTarget = page == index;
            htmlPage.classList.toggle('hidden', !isTarget);
            buttons[index].classList.toggle('S0-marked', isTarget)
        });
    }

    static async #confirmPage1(jHtml, actor) {
        const attr1 = jHtml.find("#attr1").val();
        const attr2 = jHtml.find("#attr2").val();
        const ability = jHtml.find("#ability").val();
        const specialist = jHtml.find("#specialist").prop("checked");
        const difficulty = jHtml.find("#difficulty").val();
        const rollMode = jHtml.find("#chat_select").val();

        const resultRoll = await RollAttribute.roll(actor, { attr1, attr2, ability, specialist });

        DefaultActions.sendRollOnChat(actor, resultRoll, difficulty, undefined, rollMode);
    }

    static async #confirmPage2(jHtml, actor) {
        const virtue1 = jHtml.find("#virtue1").val();
        const virtue2 = jHtml.find("#virtue2").val();
        const bonus = jHtml.find("#bonus").val();
        const penalty = jHtml.find("#penalty").val();
        const difficulty = jHtml.find("#difficulty").val();
        const automatic = jHtml.find("#automatic").val();
        const rollMode = jHtml.find("#chat_select").val();

        const resultRoll = await RollVirtue.roll(actor, { virtue1, virtue2, bonus, penalty, automatic });

        DefaultActions.processVirtueRoll(actor, resultRoll, difficulty, rollMode);
    }
}