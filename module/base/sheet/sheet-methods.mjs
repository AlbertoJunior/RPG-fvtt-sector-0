import { ElementCreator } from "../../../scripts/creators/element-creator.mjs";
import { rollAttribute } from "../../../scripts/utils/roll.mjs";
import { keyJsonToKeyLang, selectCharacteristic } from "../../../scripts/utils/utils.mjs";
import { CharacteristicType, OnClickEventType } from "../../enums/characteristic-enums.mjs";

export class SheetMethods {

    static characteristicTypeMap = {
        [CharacteristicType.ATTRIBUTE.id]: CharacteristicType.ATTRIBUTE.system,
        [CharacteristicType.ABILITY.id]: CharacteristicType.ABILITY.system,
        [CharacteristicType.VIRTUES.id]: CharacteristicType.VIRTUES.system,
        [CharacteristicType.REPERTORY.id]: CharacteristicType.REPERTORY.system,
        [CharacteristicType.LANGUAGE.id]: CharacteristicType.LANGUAGE.system,
        [CharacteristicType.TRAIT.id]: CharacteristicType.TRAIT.system,
        [CharacteristicType.SIMPLE.id]: CharacteristicType.SIMPLE.system,
    }

    static handleMethods = {
        language: {
            add: async (actor, event) => {
                const element = event.target;
                selectCharacteristic(element);

                const characteristicType = event.currentTarget.dataset.characteristic;
                const systemCharacteristic = SheetMethods.characteristicTypeMap[characteristicType];

                if (systemCharacteristic) {
                    const parentElement = element.parentElement;
                    const checked = Array.from(parentElement.children).some(el => el.classList.contains('selected'));

                    const updatedLanguages = actor.system.linguas;
                    if (checked) {
                        updatedLanguages.push(parentElement.id);
                    } else {
                        const indexToRemove = updatedLanguages.indexOf(parentElement.id);
                        if (indexToRemove !== -1) {
                            updatedLanguages.splice(indexToRemove, 1);
                        }
                    }

                    const characteristic = {
                        [`${systemCharacteristic}`]: [... new Set(updatedLanguages)]
                    };

                    await actor.update(characteristic);
                }
            }
        }
    }

    static _createDinamicSheet(html, isEditable) {
        SheetMethods.#createAttributes(html, isEditable);
        SheetMethods.#createRepertory(html, isEditable);
        SheetMethods.#createVirtues(html, isEditable);
        SheetMethods.#createAbilities(html, isEditable);
        SheetMethods.#createFame(html, isEditable);
        SheetMethods.#createLanguages(html, isEditable);
    }

    static #createAttributes(html, isEditable) {
        const characteristics = [
            { id: 'forca', label: 'S0.Forca' },
            { id: 'destreza', label: 'S0.Destreza' },
            { id: 'vigor', label: 'S0.Vigor' },
            { id: 'percepcao', label: 'S0.Percepcao' },
            { id: 'carisma', label: 'S0.Carisma' },
            { id: 'inteligencia', label: 'S0.Inteligencia' }
        ];

        const container = html.find('#atributosContainer');
        this.#create(container, characteristics, CharacteristicType.ATTRIBUTE.id, 5, isEditable, true, true);
    }

    static #createRepertory(html, isEditable) {
        const characteristics = [
            { id: 'aliados', label: 'S0.Aliados' },
            { id: 'arsenal', label: 'S0.Arsenal' },
            { id: 'informantes', label: 'S0.Informantes' },
            { id: 'recursos', label: 'S0.Recursos' },
            { id: 'superequipamentos', label: 'S0.SuperEquipamentos' }
        ];

        const container = html.find('#repertorioContainer');
        this.#create(container, characteristics, CharacteristicType.REPERTORY.id, 5, isEditable, false, false);
    }

    static #createVirtues(html, isEditable) {
        const characteristics = [
            { id: 'consciencia', label: 'S0.Consciencia' },
            { id: 'perseveranca', label: 'S0.Perseveranca' },
            { id: 'quietude', label: 'S0.Quietude' }
        ];
        const container = html.find('#virtudesContainer');
        this.#create(container, characteristics, CharacteristicType.VIRTUES.id, 5, isEditable, false, true);
    }

    static #createAbilities(html, isEditable) {
        const characteristics = [
            { id: 'armas_brancas', label: 'S0.Armas_Brancas' },
            { id: 'armas_de_projecao', label: 'S0.Armas_De_Projecao' },
            { id: 'atletismo', label: 'S0.Atletismo' },
            { id: 'briga', label: 'S0.Briga' },
            { id: 'engenharia', label: 'S0.Engenharia' },
            { id: 'expressao', label: 'S0.Expressao' },
            { id: 'furtividade', label: 'S0.Furtividade' },
            { id: 'hacking', label: 'S0.Hacking' },
            { id: 'investigacao', label: 'S0.Investigacao' },
            { id: 'medicina', label: 'S0.Medicina' },
            { id: 'manha', label: 'S0.Manha' },
            { id: 'performance', label: 'S0.Performance' },
            { id: 'pilotagem', label: 'S0.Pilotagem' },
            { id: 'quimica', label: 'S0.Quimica' },
        ];
        const container = html.find('#habilidadesContainer');
        this.#create(container, characteristics, CharacteristicType.ABILITY.id, 5, isEditable, true, false);
    }

    static #createFame(html, isEditable) {
        const container = html.find('#famaContainer');

        [
            { id: 'nucleo', label: 'S0.Nucleo', amount: 4, addLast: true, firstSelected: true },
            { id: 'influencia', label: 'S0.Influencia', amount: 5, addLast: false, firstSelected: false },
            { id: 'nivel_de_procurado', label: 'S0.Procurado', amount: 5, addLast: false, firstSelected: false },
        ].forEach(char => {
            ElementCreator._createCharacteristicContainer(container, char, CharacteristicType.SIMPLE.id, char.amount, isEditable, char.addLast, char.firstSelected);
        });
    }

    static #createLanguages(html, isEditable) {
        const container = html.find('#linguasContainer');

        [
            { id: 'domini', label: 'Domini', checked: true, district: 'Colméia', color: '#ed7d31' },
            { id: 'ameinsprache', label: 'Ameinsprache', district: 'Ameisen', color: '#c00000' },
            { id: 'aranhes', label: 'Aranhês', district: 'Aranhas', color: '#ffd965' },
            { id: 'bantura', label: 'Bantura', district: 'Vyura', color: '#2e75b5' },
            { id: 'kemyura', label: 'Kemyura', district: 'Vyura', color: '#2e75b5' },
            { id: 'dameise', label: 'L\'Ameise', district: 'Ameisen', color: '#c00000' },
            { id: 'ptikor', label: 'Ptikor', district: 'Ptitsy', color: '#548135' },
            { id: 'ptisyan', label: 'Ptisyan', district: 'Ptitsy', color: '#548135' },
            { id: 'tokojhae', label: 'Tokojhae', district: 'Tokojirami', color: '#7030a0' },
            { id: 'tokuma', label: 'Tokumá', district: 'Tokojirami', color: '#7030a0' },
            { id: 'Zuarur', label: 'Zu\'arur', district: 'Alfiran', color: '#262626' },
        ].forEach(lang => {
            ElementCreator._createCharacteristicContainer(
                container, lang, CharacteristicType.LANGUAGE.id, 1, isEditable, false, lang.checked || false, OnClickEventType.ADD
            );
        });
    }

    static #create(container, characteristics, type, amount, isEditable, addLast, firstSelected) {
        characteristics.forEach(characteristic => {
            ElementCreator._createCharacteristicContainer(container, characteristic, type, amount, isEditable, addLast, firstSelected)
        });
    }

    static async _openRollDialog(actor) {
        const system = actor.system;
        const atributoKeys = Object.keys(system.atributos);
        const abilitiesKeys = Object.keys(system.habilidades);

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

        const content = `
                <form style="margin-block:10px">
                        <h3>${game.i18n.localize('S0.Atributos')}</h3>
                        <div class="form-group">
                            <select id="attr1" style="margin-inline:4px">${options}</select>
                            <select id="attr2" style="margin-inline:4px">${options}</select>
                        </div>
                        <h3 style="margin-top:10px">${game.i18n.localize('S0.Habilidades')}</h3>
                        <div class="form-group">
                            <select id="ability" style="flex:1; margin-inline:4px">${options2}</select>
                            <div style="display: flex; flex: 1; align-items: center; justify-content: space-between;">
                            <label for="specialist" style="flex:1; margin-inline:4px">${game.i18n.localize('S0.Especialista')}:</label>
                            <input id="specialist" type="checkbox" style="margin-inline:4px">
                            </div>
                        </div>
                        <h3 style="margin-top: 10px">${game.i18n.localize('S0.Outros')}</h3>
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

        return new Promise(resolve => {
            new Dialog({
                title: "Escolha os Atributos",
                content,
                buttons: {
                    cancel: {
                        label: "Cancelar",
                        callback: () => resolve(null)
                    },
                    confirm: {
                        label: "Rolar",
                        callback: (html) => {
                            const attr1 = html.find("#attr1").val();
                            const attr2 = html.find("#attr2").val();
                            const ability = html.find("#ability").val();
                            const specialist = html.find("#specialist").prop("checked");
                            const difficulty = html.find("#difficulty").val();
                            resolve(rollAttribute(actor, attr1, attr2, ability, specialist, difficulty));
                        }
                    }
                }
            }).render(true);
        });
    }
}