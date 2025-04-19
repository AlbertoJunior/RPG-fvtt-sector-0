import { DialogUtils } from "../../utils/dialog-utils.mjs";
import { localize } from "../../../scripts/utils/utils.mjs";

export class UpdateEquipmentQuantityDialog {
    static async updateQuantityDialog(quantity, onConfirm = () => { }) {
        const content = await this.#mountContent(quantity);

        new Dialog({
            title: localize("Alterar_Quantidade"),
            content: content,
            buttons: {
                cancel: {
                    label: localize("Remover"),
                    callback: (html) => {
                        const attr1 = this.#getValue(html);
                        onConfirm?.(-attr1);
                    }
                },
                confirm: {
                    label: localize("Adicionar"),
                    callback: (html) => {
                        const attr1 = this.#getValue(html);
                        onConfirm?.(attr1);
                    }
                }
            },
            render: (html) => {
                DialogUtils.presetDialogRender(html);
            },
        }).render(true);
    }

    static async #mountContent(quantity) {
        const data = {
            quantity
        }
        return await renderTemplate("systems/setor0OSubmundo/templates/items/quantity-dialog.hbs", data);
    }

    static #getValue(html) {
        return parseInt(html.find("#quantity").val());
    }
}