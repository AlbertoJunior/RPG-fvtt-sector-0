import { RollAttribute } from "../../core/rolls/attribute-roll.mjs";
import { getObject, keyJsonToKeyLang, localize } from "../../../scripts/utils/utils.mjs";
import { DefaultActions } from "../../utils/default-actions.mjs";
import { CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { DialogUtils } from "../../utils/dialog-utils.mjs";

export class ActorRollDialog {
    static async _open(actor) {
        const content = await this.#mountContent(actor);

        new Dialog({
            title: localize("Realizar_Teste"),
            content,
            buttons: {
                cancel: {
                    label: localize("Cancelar"),
                    callback: (html) => { }
                },
                confirm: {
                    label: localize("Rolar"),
                    callback: async (html) => {
                        const attr1 = html.find("#attr1").val();
                        const attr2 = html.find("#attr2").val();
                        const ability = html.find("#ability").val();
                        const specialist = html.find("#specialist").prop("checked");
                        const difficulty = html.find("#difficulty").val();
                        const rollMode = html.find("#chat_select").val();

                        const resultRoll = await RollAttribute.roll(actor, { attr1, attr2, ability, specialist });

                        DefaultActions.sendRollOnChat(actor, resultRoll, difficulty, undefined, rollMode);
                    }
                }
            },
            render: (html) => {
                DialogUtils.presetDialogRender(html);
            },
            default: 'confirm',
        }).render(true);
    }

    static async #mountContent(actor) {
        const attributesOptions = Object.keys(getObject(actor, CharacteristicType.ATTRIBUTE))
            .map(attr => {
                return {
                    label: game.i18n.localize(keyJsonToKeyLang(attr)),
                    value: attr
                }
            });

        const abilitiesOptions = Object.keys(getObject(actor, CharacteristicType.ABILITY))
            .map(attr => {
                return {
                    label: game.i18n.localize(keyJsonToKeyLang(attr)),
                    value: attr
                }
            });

        const difficultyOptions = [5, 6, 7, 8, 9, 10]
            .map(attr => {
                return {
                    label: attr,
                    value: attr,
                    isDefault: attr == 6
                }
            });

        const data = {
            attributes: attributesOptions,
            abilities: abilitiesOptions,
            difficulty: difficultyOptions,
            isGM: game.user.isGM,
        }
        return await renderTemplate("systems/setor0OSubmundo/templates/rolls/default-roll.hbs", data);
    }
}