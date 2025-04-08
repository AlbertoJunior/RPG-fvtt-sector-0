import { rollAttribute } from "../../rolls/roll.mjs";
import { keyJsonToKeyLang, localize, TODO } from "../../utils/utils.mjs";
import { ChatCreator } from "../chat-creator.mjs";
import { RollMessageCreator } from "../messages/roll-mesage.mjs";

export class ActorRollDialog {
    static async _open(actor) {
        const content = this.#mountContent(actor);

        new Dialog({
            title: "Escolha os Atributos",
            content,
            buttons: {
                cancel: {
                    label: "Cancelar",
                    callback: (html) => { }
                },
                confirm: {
                    label: "Rolar",
                    callback: async (html) => {
                        const attr1 = html.find("#attr1").val();
                        const attr2 = html.find("#attr2").val();
                        const ability = html.find("#ability").val();
                        const specialist = html.find("#specialist").prop("checked");
                        const difficulty = html.find("#difficulty").val();

                        const resultRoll = await rollAttribute(actor, { attr1, attr2, ability, specialist, difficulty });
                        const rollItems = resultRoll.roll;
                        const rolls = [];
                        if (rollItems.default.roll != undefined) {
                            const objectRoll = rollItems.default.roll;
                            objectRoll.options.isOverload = false;
                            rolls.push(objectRoll);
                        }
                        if (rollItems.overload.roll != undefined) {
                            const objectRoll = rollItems.overload.roll;
                            objectRoll.options.isOverload = true;
                            rolls.push(objectRoll);
                        }

                        const message = await RollMessageCreator.mountContent(resultRoll.roll, resultRoll.attrs, resultRoll.abilityInfo, difficulty);

                        console.log(await ChatCreator._sendToChatTypeRoll(actor, message, rolls));
                    }
                }
            }
        }).render(true);
    }

    static #mountContent(actor) {
        const system = actor.system;
        const atributoKeys = Object.keys(system.atributos);
        const abilitiesKeys = Object.keys(system.habilidades);

        TODO('fazer o mount content com arquivos .hbs');

        const options = atributoKeys
            .map(attr => {
                const label = game.i18n.localize(keyJsonToKeyLang(attr));
                return `<option value="${attr}">${label}</option>`;
            })
            .join("");

        const options2 = abilitiesKeys
            .map(attr => {
                const label = game.i18n.localize(keyJsonToKeyLang(attr));
                return `<option value="${attr}">${label}</option>`
            })
            .join("");

        const options3 = [5, 6, 7, 8, 9, 10]
            .map(attr => `<option value="${attr}" ${attr === 6 ? 'selected' : ''}>${attr}</option>`)
            .join("");

        return `
                <form style="margin-block:10px">
                        <h3>${localize('Atributos')}</h3>
                        <div class="form-group">
                            <select id="attr1" style="margin-inline: 4px">${options}</select>
                            <select id="attr2" style="margin-inline: 4px">${options}</select>
                        </div>
                        <h3 style="margin-top:10px">${localize('Habilidades')}</h3>
                        <div class="form-group">
                            <select id="ability" style="flex:1; margin-inline:4px">${options2}</select>
                            <div style="display: flex; flex: 1; align-items: center; justify-content: space-between;">
                            <label for="specialist" style="flex:1; margin-inline:4px">${localize('Especialista')}:</label>
                            <input id="specialist" type="checkbox" style="margin-inline:4px">
                            </div>
                        </div>
                        <h3 style="margin-top: 10px">${localize('Outros')}</h3>
                        <div class="form-group">
                            <label for="difficulty" style="flex:1; margin-inline:4px">Dificuldade:</label>
                            <select id="difficulty" style="margin-inline:4px; flex:1">${options3}</select>
                        </div>
                         <div class="form-group">
                            <label for="bonus"  style="flex:1; margin-inline:4px">Bônus:</label>
                            <input id="bonus" type="number" style="flex:1; margin-inline:4px">
                        </div>
                </form>
            `;
    }
}