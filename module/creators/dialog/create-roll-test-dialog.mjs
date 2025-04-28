import { AttributeRepository } from "../../repository/attribute-repository.mjs";
import { AbilityRepository } from "../../repository/ability-repository.mjs";
import { localize, randomId } from "../../../scripts/utils/utils.mjs"
import { DialogUtils } from "../../utils/dialog-utils.mjs";
import { ConfirmationDialog } from "./confirmation-dialog.mjs";

export class CreateRollableTestDialog {
    static async _view(rollableData) {
        this._open(rollableData);
    }

    static async _open(rollableData, onConfirm, onDelete) {
        const needConfirmation = onConfirm !== undefined;
        const isCreate = rollableData == undefined;

        const buttons = this.#createButtons(rollableData, { confirm: onConfirm, delete: onDelete });
        const content = await this.#mountContent(rollableData, needConfirmation, buttons);
        const mode = this.#getDialogMode(isCreate, needConfirmation);

        const dialog = new Dialog({
            title: `${mode} Teste do Item`,
            content,
            buttons: {},
            render: (html) => {
                DialogUtils.presetDialogRender(html);

                if (buttons) {
                    Object.keys(buttons).forEach(key => {
                        const button = buttons[key];
                        const buttonElement = html.find(`[data-action="${key}"]`);
                        buttonElement.on("click", () => {
                            if (button.callback !== undefined) {
                                button.callback(html, dialog);
                                if (button.closeDialog == false) {
                                    return;
                                }
                            }
                            dialog.close();
                        });
                    });
                }
            },
        });
        dialog.render(true);
    }

    static #getDialogMode(isCreate, needConfirmation) {
        let mode = '';
        if (isCreate) {
            mode = "Criar";
        } else if (needConfirmation) {
            mode = "Editar";
        } else {
            mode = "Visualizar";
        }

        return mode;
    }

    static #createButtons(rollableData, eventButtons) {
        const { confirm: onConfirm, delete: onDelete } = eventButtons;
        const haveOnConfirm = onConfirm !== undefined;
        const haveOnDelete = onDelete !== undefined;

        let buttons;
        if (haveOnConfirm) {
            buttons = {};

            if (haveOnDelete) {
                buttons['delete'] = {
                    label: localize("Apagar"),
                    closeDialog: false,
                    classes: 'S0-button-delete',
                    icon: 'fa-trash',
                    callback: (html, dialog) => {
                        ConfirmationDialog.open({
                            onConfirm: () => {
                                onDelete(rollableData);
                                dialog.close();
                            }
                        });
                    }
                };
            } else {
                buttons['cancel'] = {
                    label: localize("Cancelar"),
                    classes: 'S0-button-confirm',
                };
            }

            buttons['confirm'] = {
                label: onDelete ? localize("Editar") : localize("Criar"),
                classes: 'S0-button-confirm default',
                icon: onDelete ? 'fa-edit' : 'fa-square-plus',
                callback: (html, dialog) => {
                    const form = html[0].querySelector("form");
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    const parsed = {
                        id: rollableData?.id || randomId(),
                        name: data.name,
                        primary_attribute: data.primary_attribute,
                        secondary_attribute: data.secondary_attribute,
                        ability: data.ability,
                        bonus: Number(data.bonus || 0),
                        automatic: Number(data.automatic || 0),
                        difficulty: Number(data.difficulty || 6),
                        specialist: Boolean(formData.has("specialist"))
                    };
                    onConfirm(parsed);
                }
            };

            Object.keys(buttons).forEach(key => {
                buttons[key].key = key;
            });
        }

        return buttons;
    }

    static async #mountContent(rollableData, needConfirmation, buttons) {
        const data = {
            canEdit: needConfirmation,
            attributes: AttributeRepository._getItems(),
            abilities: AbilityRepository._getItems(),
            difficulty: 6,
            bonus: 0,
            automatic: 0,
            specialist: false,
            buttons: buttons !== undefined ? Object.values(buttons) : null,
            ...rollableData
        };

        return await renderTemplate("systems/setor0OSubmundo/templates/rolls/create-roll-test-dialog.hbs", data);
    }
}
