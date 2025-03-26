import { rollAttribute } from "../../../scripts/utils/roll.mjs";
import { keyJsonToKeyLang } from "../../../scripts/utils/utils.mjs";

export const CharacteristicType = Object.freeze({
    ATTRIBUTE: 'atributos',
    VIRTUES: 'virtudes',
    REPERTORY: 'repertorio',
    ABILITY: 'habilidades',
    SIMPLE: '',
});

export class SheetMethods {
    static _createDinamicSheet(html, isEditable) {
        SheetMethods._createAttributes(html, isEditable);
        SheetMethods._createRepertory(html, isEditable);
        SheetMethods._createVirtues(html, isEditable);
        SheetMethods._createAbilities(html, isEditable);
        SheetMethods._createOthers(html, isEditable);
    }

    static _createAttributes(html, isEditable) {
        const characteristics = [
            { id: 'forca', label: 'S0.Forca' },
            { id: 'destreza', label: 'S0.Destreza' },
            { id: 'vigor', label: 'S0.Vigor' },
            { id: 'percepcao', label: 'S0.Percepcao' },
            { id: 'carisma', label: 'S0.Carisma' },
            { id: 'inteligencia', label: 'S0.Inteligencia' }
        ];

        const container = html.find('#atributosContainer');
        this._create(container, characteristics, CharacteristicType.ATTRIBUTE, 5, isEditable, true, true);
    }

    static _createRepertory(html, isEditable) {
        const characteristics = [
            { id: 'aliados', label: 'S0.Aliados' },
            { id: 'arsenal', label: 'S0.Arsenal' },
            { id: 'informantes', label: 'S0.Informantes' },
            { id: 'recursos', label: 'S0.Recursos' },
            { id: 'superequipamentos', label: 'S0.SuperEquipamentos' }
        ];

        const container = html.find('#repertorioContainer');
        this._create(container, characteristics, CharacteristicType.REPERTORY, 5, isEditable, false, false);
    }

    static _createVirtues(html, isEditable) {
        const characteristics = [
            { id: 'consciencia', label: 'S0.Consciencia' },
            { id: 'perseveranca', label: 'S0.Perseveranca' },
            { id: 'quietude', label: 'S0.Quietude' }
        ];
        const container = html.find('#virtudesContainer');
        this._create(container, characteristics, CharacteristicType.VIRTUES, 5, isEditable, false, true);
    }

    static _createAbilities(html, isEditable) {
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
        this._create(container, characteristics, CharacteristicType.ABILITY, 5, isEditable, true, false);
    }

    static _createOthers(html, isEditable) {
        const container = html.find('#famaContainer');

        [
            { id: 'nucleo', label: 'S0.Nucleo', amount: 4, addLast: true, firstSelected: true },
            { id: 'influencia', label: 'S0.Influencia', amount: 5, addLast: false, firstSelected: false },
            { id: 'nivel_de_procurado', label: 'S0.Procurado', amount: 5, addLast: false, firstSelected: false },
        ].forEach(char => {
            this._createSingle(container, char, CharacteristicType.SIMPLE, char.amount, isEditable, char.addLast, char.firstSelected);
        });
    }

    static _create(container, characteristics, type, amount, isEditable, addLast, firstSelected) {
        characteristics.forEach(characteristic => {
            this._createSingle(container, characteristic, type, amount, isEditable, addLast, firstSelected)
        });
    }

    static _createSingle(container, characteristic, type, amount, isEditable, addLast, firstSelected) {
        const createCharacteristicDiv = (isEditable) => {
            return $('<div>', {
                class: isEditable ? `caracteristica clickable` : `caracteristica`,
                'data-action': isEditable ? 'characteristicOnClick' : undefined,
                'data-characteristic': type
            });
        };

        const divContainer = $('<div>', {
            class: 'characteristic-container',
            id: characteristic.id
        });

        const label = $('<label>', {
            text: game.i18n.localize(characteristic.label)
        });

        divContainer.append(label);

        for (let i = 0; i < amount; i++) {
            const divCaracteristica = createCharacteristicDiv(isEditable);
            if (firstSelected && i == 0) {
                divCaracteristica.addClass('selected');
            }
            divContainer.append(divCaracteristica);
        }

        if (addLast) {
            const divCaracteristica = createCharacteristicDiv(isEditable);
            divCaracteristica.addClass('caracteristica-6');
            divContainer.append(divCaracteristica);
        }

        container.append(divContainer);
        return divContainer[0];
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
                            <label for="specialist" style="flex:1; margin-inline:4px">${game.i18n.localize('S0.Especialista')}:</label>
                            <input id="specialist" type="checkbox" style="flex:1; margin-inline:4px">
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
                    roll: {
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
                },
                default: "roll"
            }).render(true);
        });
    }
}