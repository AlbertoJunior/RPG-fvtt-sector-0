import { localize, randomId, snakeToCamel } from "../../../scripts/utils/utils.mjs";
import { DialogUtils } from "../../utils/dialog-utils.mjs";
import { AttributeRepository } from "../../repository/attribute-repository.mjs";
import { AbilityRepository } from "../../repository/ability-repository.mjs";
import { VirtuesRepository } from "../../repository/virtues-repository.mjs";
import { OnEventType } from "../../enums/on-event-type.mjs";
import { BaseActorCharacteristicType, CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { ActorUtils } from "../../core/actor/actor-utils.mjs";
import { RepertoryRepository } from "../../repository/repertory-repository.mjs";
import { playerRollHandle } from "../../base/sheet/actor/player/methods/player-roll-methods.mjs";
import { TEMPLATES_PATH } from "../../constants.mjs";

export class ActorRollDialog {
    static #mapedPagesMethods = {
        0: ActorRollDialog.#confirmDefaultRoll,
        1: ActorRollDialog.#confirmVirtueRoll,
        2: ActorRollDialog.#confirmSimplifiedRoll,
        3: ActorRollDialog.#confirmCustomRoll,
    };

    static async open(actor) {
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

                        ActorRollDialog.#mapedPagesMethods[currentPageDialog]?.(actor, data, rollMode);
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
        }, { width: 430 }).render(true);
    }

    static #mountDataOptions(actor) {
        const attributesOptions = AttributeRepository.getItems()
            .map(attr => {
                return {
                    id: attr.id,
                    label: game.i18n.localize(attr.label),
                }
            });

        const abilitiesOptions = AbilityRepository.getItems()
            .map(attr => {
                return {
                    id: attr.id,
                    label: game.i18n.localize(attr.label),
                }
            });

        const virtueOptions = VirtuesRepository.getItems();

        const enhancementOptions = ActorUtils.getAllEnhancements(actor)
            .map(enhance => {
                return {
                    id: `${CharacteristicType.ENHANCEMENT.id}_${enhance.id}`,
                    label: enhance.name
                }
            });

        const repertoryOptions = RepertoryRepository.getItems().map(repertory => {
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
                group_label: localize('Aprimoramento.Nome_Plural'),
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
                        id: BaseActorCharacteristicType.BOUNTY.id,
                        label: localize('Nivel_De_Procurado'),
                    },
                    {
                        id: BaseActorCharacteristicType.INFLUENCE.id,
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
        return await renderTemplate(`${TEMPLATES_PATH}/rolls/default-roll-dialog.hbs`, data);
    }

    static #changePage(page, pages, buttons) {
        pages.each((index, htmlPage) => {
            const isTarget = page == index;
            htmlPage.classList.toggle('hidden', !isTarget);
            buttons[index].classList.toggle('S0-marked', isTarget)
        });
    }

    static async #confirmDefaultRoll(actor, data, rollMode) {
        const inputParams = {
            attr1: data["attr1"],
            attr2: data["attr2"],
            ability: data["ability"],
            bonus: Number(data["bonus"]),
            automatic: Number(data["automatic"]),
            specialist: Boolean(data["specialist"]),
            isHalf: Boolean(data["divided"]),
            difficulty: Number(data["difficulty"]),
            critic: Number(data["critic"]),
            rollMode: rollMode,
        };

        await playerRollHandle.default(actor, inputParams);
    }

    static async #confirmVirtueRoll(actor, data, rollMode) {
        const inputParams = {
            virtue1: data["virtue1"],
            virtue2: data["virtue2"],
            bonus: Number(data["bonus"]),
            penalty: Number(data["penalty"]),
            automatic: Number(data["automatic"]),
            difficulty: Number(data["difficulty"]),
            rollMode: rollMode,
        };

        await playerRollHandle.virtue(actor, inputParams);
    }

    static async #confirmCustomRoll(actor, data, rollMode) {
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
            rollMode,
        };

        await playerRollHandle.custom(actor, inputParams);
    }

    static async #confirmSimplifiedRoll(actor, data, rollMode) {
        const inputParams = {
            half: Boolean(data["half"]),
            specialist: Boolean(data["specialist"]),
            value: Number(data["value"]),
            automatic: Number(data["automatic"]),
            difficulty: Number(data["difficulty"]),
            critic: Number(data["critic"]),
            rollMode,
        };

        await playerRollHandle.simple(actor, inputParams);
    }
}