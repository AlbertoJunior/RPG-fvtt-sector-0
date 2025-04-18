import { AttributeRepository } from "../../repository/attribute-repository.mjs";
import { AbilityRepository } from "../../repository/ability-repository.mjs";
import { randomId } from "../../../scripts/utils/utils.mjs"

export class CreateRollableTestDialog {
    static async _view(rollableData) {
        this._open(rollableData);
    }

    static async _open(rollableData, onConfirm) {
        const needConfirmation = onConfirm !== undefined;
        const isCreate = rollableData == undefined;

        const content = await this.#mountContent(rollableData, needConfirmation);

        const mode = this.#getDialogMode(isCreate, needConfirmation);

        const dialog = new Dialog({
            title: `${mode} Teste Rolável`,
            content,
            buttons: {}
        });

        if (needConfirmation) {
            dialog.data.buttons = {
                cancel: {
                    label: "Cancelar"
                },
                confirm: {
                    label: "Confirmar",
                    callback: (html) => {
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
                }
            }
        }

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

    static async #mountContent(rollableData, needConfirmation) {
        const data = {
            canEdit: needConfirmation,
            attributes: AttributeRepository._getItems(),
            abilities: AbilityRepository._getItems(),
            difficulty: 6,
            bonus: 0,
            automatic: 0,
            specialist: false,
            ...rollableData
        };

        return await renderTemplate("systems/setor0OSubmundo/templates/rolls/create-roll-test-dialog.hbs", data);
    }
}
