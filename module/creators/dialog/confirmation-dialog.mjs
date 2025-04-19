import { localize } from "../../../scripts/utils/utils.mjs";
import { DialogUtils } from "../../utils/dialog-utils.mjs";

export class ConfirmationDialog {
    static async open(params = { onConfirm: () => { }, onCancel: () => { } }) {
        const { titleDialog, cancelButtonText, confirmButtonText, message, titleMessage, onConfirm, onCancel } = params;

        const content = await this.#mountContent(message, titleMessage);

        new Dialog({
            title: titleDialog || localize("Confirmar"),
            content: content,
            buttons: {
                cancel: {
                    label: cancelButtonText || localize("Cancelar"),
                    callback: (html) => {
                        onCancel?.();
                    }
                },
                confirm: {
                    label: confirmButtonText || localize("Confirmar"),
                    callback: (html) => {
                        onConfirm?.();
                    }
                }
            },
            render: (html) => {
                DialogUtils.presetDialogRender(html);
            },
            default: 'confirm',
            close: () => { }
        }).render(true);
    }

    static async #mountContent(message, title) {
        const data = {
            title: title || localize("Pergunta_Realizar_Acao"),
            message
        }
        return await renderTemplate("systems/setor0OSubmundo/templates/others/confirmation-dialog.hbs", data);
    }
}