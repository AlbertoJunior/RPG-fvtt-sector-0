import { localize, snakeToCamel } from "../../../scripts/utils/utils.mjs"
import { DialogUtils } from "../../utils/dialog-utils.mjs";

export class CreateFormDialog {
    static async _open(title, fileHtml, onConfirm) {
        const buttons = this.#createButtons({ confirm: onConfirm });
        const content = await this.#mountContent(fileHtml.replace(/\.[^/.]+$/, ''), buttons);

        if (!this.#verifyContentIsValid(content)) {
            console.error('Content is invalid')
            return;
        }

        const dialog = new Dialog({
            title,
            content,
            buttons: {},
            render: (html) => {
                this.#render(html, dialog, buttons);
            },
        });
        dialog.render(true);
    }

    static #createButtons(eventButtons) {
        const { confirm: onConfirm } = eventButtons;

        let buttons = {};
        buttons['cancel'] = {
            label: localize("Cancelar"),
            classes: 'S0-button-confirm',
        };
        buttons['confirm'] = {
            label: localize("Confirmar"),
            classes: 'S0-button-confirm default',
            callback: (html) => {
                const form = html[0].querySelector("form");
                const formData = new FormData(form);
                const data = snakeToCamel(formData.entries());
                onConfirm(data);
            }
        };

        Object.keys(buttons).forEach(key => {
            buttons[key].key = key;
        });

        return buttons;
    }

    static async #mountContent(fileHtml, buttons) {
        const dataForm = {
        };
        const dataButtons = {
            buttons: buttons !== undefined ? Object.values(buttons) : null,
        };

        const formHtml = await renderTemplate(`systems/setor0OSubmundo/templates/${fileHtml}.hbs`, dataForm);
        const buttonsHtml = await renderTemplate(`systems/setor0OSubmundo/templates/others/buttons-dialog.hbs`, dataButtons);

        return `<div class="S0-dialog">
        ${formHtml}
        ${buttonsHtml}
        </div>
        ` ;
    }

    static #verifyContentIsValid(content) {
        return content.includes("<form");
    }

    static #render(html, dialog, buttons) {
        DialogUtils.presetDialogRender(html);
        this.#setupButtonsRender(html, dialog, buttons);
    }

    static #setupButtonsRender(html, dialog, buttons) {
        if (buttons) {
            Object.keys(buttons).forEach(key => {
                const button = buttons[key];
                const buttonElement = html.find(`[data-action="${key}"]`);

                buttonElement.on("click", () => {
                    if (button.callback !== undefined) {
                        button.callback(html);
                        if (button.closeDialog == false) {
                            return;
                        }
                    }
                    dialog.close();
                });
            });
        }
    }
}
