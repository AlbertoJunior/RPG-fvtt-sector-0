import { RollAttribute } from "../../core/rolls/attribute-roll.mjs";
import { localize, randomId, snakeToCamel } from "../../../scripts/utils/utils.mjs";
import { DefaultActions } from "../../utils/default-actions.mjs";
import { DialogUtils } from "../../utils/dialog-utils.mjs";
import { AttributeRepository } from "../../repository/attribute-repository.mjs";
import { AbilityRepository } from "../../repository/ability-repository.mjs";
import { VirtuesRepository } from "../../repository/virtues-repository.mjs";
import { OnEventType } from "../../enums/on-event-type.mjs";
import { RollVirtue } from "../../core/rolls/virtue-roll.mjs";
import { CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { EnhancementRepository } from "../../repository/enhancement-repository.mjs";
import { CustomRoll } from "../../core/rolls/custom-roll.mjs";
import { ActorUtils } from "../../core/actor/actor-utils.mjs";
import { RepertoryRepository } from "../../repository/repertory-repository.mjs";

export class ActorRollDialog {
    static mapedPagesMethods = {
        0: ActorRollDialog.#confirmPage1,
        1: ActorRollDialog.#confirmPage2,
        2: ActorRollDialog.#confirmPage3,
    };

    static async _open(actor) {
        const uuid = `roll_dialog.${randomId(10)}`;
        const dataOptions = this.#mountDataOptions(actor);
        const content = await this.#mountContent(uuid, dataOptions);

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
                        const page = pages[currentPageDialog];
                        if (!page) {
                            return;
                        }

                        const form = $(page).closest("form")[0];
                        const data = snakeToCamel(new FormData(form).entries());
                        const rollMode = html.parent().find(`#chat_select`).val();
                        if (!data) {
                            return
                        }

                        ActorRollDialog.mapedPagesMethods[currentPageDialog]?.(actor, data, rollMode);
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

    static #mountDataOptions(actor) {
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

        const enhancementOptions = ActorUtils.getAllEnhancements(actor)
            .map(enhance => {
                return {
                    id: `${CharacteristicType.ENHANCEMENT.id}_${enhance.id}`,
                    label: enhance.name
                }
            });

        const repertoryOptions = RepertoryRepository._getItems().map(repertory => {
            return {
                id: repertory.id,
                label: game.i18n.localize(repertory.label)
            }
        });

        const allCharacteristicOptionsGroup = [];
        allCharacteristicOptionsGroup.push(
            {
                group_label: localize('Atributos'),
                group_items: attributesOptions
            }
        );
        allCharacteristicOptionsGroup.push(
            {
                group_label: localize('Habilidades'),
                group_items: abilitiesOptions
            }
        );
        allCharacteristicOptionsGroup.push(
            {
                group_label: localize('Virtudes'),
                group_items: virtueOptions
            }
        );
        allCharacteristicOptionsGroup.push(
            {
                group_label: localize('Aprimoramentos'),
                group_items: enhancementOptions,
            }
        );
        allCharacteristicOptionsGroup.push(
            {
                group_label: localize('Repertorio'),
                group_items: repertoryOptions,
            }
        );
        allCharacteristicOptionsGroup.push(
            {
                group_label: localize('Outros'),
                group_items: [
                    {
                        id: CharacteristicType.CORE.id,
                        label: localize('Nucleo'),
                    },
                    {
                        id: CharacteristicType.BOUNTY.id,
                        label: localize('Nivel_De_Procurado'),
                    },
                    {
                        id: CharacteristicType.INFLUENCE.id,
                        label: localize('Influencia'),
                    },
                    {
                        id: 'zero',
                        label: 'Zero',
                    }
                ]
            }
        );
        allCharacteristicOptionsGroup.push(
            {
                group_label: 'Vazio',
                group_items: [
                    {
                        label: '',
                    },
                ]
            }
        );

        return {
            attributes: attributesOptions,
            abilities: abilitiesOptions,
            virtues: virtueOptions,
            allCharacteristic: allCharacteristicOptionsGroup,
        }
    }

    static async #mountContent(uuid, dataOptions) {
        const data = {
            uuid: uuid,
            ...dataOptions
        }
        return await renderTemplate("systems/setor0OSubmundo/templates/rolls/default-roll-dialog.hbs", data);
    }

    static #changePage(page, pages, buttons) {
        pages.each((index, htmlPage) => {
            const isTarget = page == index;
            htmlPage.classList.toggle('hidden', !isTarget);
            buttons[index].classList.toggle('S0-marked', isTarget)
        });
    }

    static async #confirmPage1(actor, data, rollMode) {
        const inputParams = {
            attr1: data["attr1"],
            attr2: data["attr2"],
            ability: data["ability"],
            bonus: Number(data["bonus"]),
            automatic: Number(data["automatic"]),
            specialist: Boolean(data["specialist"]),
            isHalf: Boolean(data["divided"]),
        };

        const difficulty = Number(data["difficulty"]);
        const critic = Number(data["critic"]);

        const resultRoll = await RollAttribute.roll(actor, inputParams);
        await DefaultActions.sendRollOnChat(actor, resultRoll, difficulty, critic, undefined, rollMode);
    }

    static async #confirmPage2(actor, data, rollMode) {
        const inputParams = {
            virtue1: data["virtue1"],
            virtue2: data["virtue2"],
            bonus: Number(data["bonus"]),
            penalty: Number(data["penalty"]),
            automatic: Number(data["automatic"]),
        };

        const difficulty = Number(data["difficulty"]);

        const resultRoll = await RollVirtue.roll(actor, inputParams);
        await DefaultActions.processVirtueRoll(actor, resultRoll, difficulty, rollMode);
    }

    static async #confirmPage3(actor, data, rollMode) {
        function characteristic(value, characteristicKey) {
            const result = {
                [characteristicKey]: value,
                [`special_${characteristicKey}`]: ''
            };

            if (value.includes(CharacteristicType.ENHANCEMENT.id)) {
                const [base, special] = value.split("_");
                result[characteristicKey] = base;
                result[`special_${characteristicKey}`] = special;
            }

            return result;
        }

        const inputParams = {
            ...characteristic(data["characteristic1"], 'primary'),
            ...characteristic(data["characteristic2"], 'secondary'),
            ...characteristic(data["characteristic3"], 'tertiary'),
            half: Boolean(data["half"]),
            specialist: Boolean(data["specialist"]),
            bonus: Number(data["bonus"]),
            automatic: Number(data["automatic"]),
            difficulty: Number(data["difficulty"]),
            critic: Number(data["critic"]),
        };

        const resultRoll = await CustomRoll.discoverAndRoll(actor, inputParams);
        await DefaultActions.processCustomRoll(actor, resultRoll, inputParams, 'Teste Customizado', rollMode);
    }
}