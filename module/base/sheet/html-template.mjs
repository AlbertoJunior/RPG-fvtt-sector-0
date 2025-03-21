import { getActorFlag, selectCharacteristic, setActorFlag } from "../utils/utils.mjs";

class Setor0ActorSheet extends ActorSheet {
    activateListeners(html) {
        super.activateListeners(html);
        this._dinamicSheet(html);
        this._presetSheet(html);
        this._setupListeners(html);
    }

    _setupListeners(html) {
        html.find('#edit-mode-toggle').click(this._toggleEditMode.bind(this));
        html.find('[data-action="characteristicOnClick"]').click(this._characteristicOnClick.bind(this));
    }

    _toggleEditMode(event) {
        event.preventDefault();

        let currentValue = getActorFlag(editable);
        currentValue = !currentValue;

        setActorFlag(this.actor, "editable", currentValue)
            .then(() => this.render());
    }

    getData() {
        const data = super.getData();
        data.editable = this.actor.getFlag("setor0OSubmundo", "editable") || false;
        return data;
    }

    get isEditable() {
        return this.actor.getFlag("setor0OSubmundo", "editable") || false;
    }

    _dinamicSheet(html) {
        const atributos = [
            { id: 'forca', label: 'S0.Forca' },
            { id: 'destreza', label: 'S0.Destreza' },
            { id: 'vigor', label: 'S0.Vigor' },
            { id: 'percepcao', label: 'S0.Percepcao' },
            { id: 'carisma', label: 'S0.Carisma' },
            { id: 'inteligencia', label: 'S0.Inteligencia' }
        ];

        const atributosContainer = html.find('#atributosContainer');

        atributos.forEach(atributo => {
            const divContainer = $('<div>', {
                class: 'characteristic-container',
                id: atributo.id
            });

            const label = $('<label>', {
                text: game.i18n.localize(atributo.label)
            });

            divContainer.append(label);

            for (let i = 0; i < 6; i++) {
                const divCaracteristica = (this.isEditable) ? $('<div>', {
                    class: (i < 5) ? 'caracteristica clickable' : 'caracteristica-6 clickable',
                    'data-action': 'characteristicOnClick'
                }) : $('<div>', {
                    class: (i < 5) ? 'caracteristica' : 'caracteristica-6',
                });

                if (i === 0) {
                    divCaracteristica.addClass('selected');
                }

                divContainer.append(divCaracteristica);
            }
            atributosContainer.append(divContainer);
        });
    }

    _presetSheet(html) {
        const data = this.actor.system;

        const preselecteds = html.find('.selected');
        preselecteds.removeClass('selected');

        const elementos = html.find('#atributosContainer')[0];
        let hasNext = elementos.firstElementChild;
        while (hasNext) {
            selectCharacteristic(hasNext.children[data.atributos[hasNext.id]]);
            hasNext = hasNext.nextElementSibling;
        }
    }

    async _characteristicOnClick(event) {
        console.log(event)
        event.preventDefault();

        const element = event.target;
        selectCharacteristic(element);

        const parentElement = element.parentElement;
        const level = Array.from(parentElement.children).filter(el => el.classList.contains('selected')).length;

        const characteristic = {};
        characteristic[`system.atributos.${parentElement.id}`] = level;
        await this.actor.update(characteristic);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["setor0OSubmundo", "sheet", "actor"],
            template: "systems/setor0OSubmundo/templates/actors/actor-sheet.hbs",
            width: 600,
            height: 900
        });
    }
}

export function htmlTemplateRegister() {
    Actors.registerSheet("Setor 0", Setor0ActorSheet, { makeDefault: true });
    console.log('Modelos de dados e fichas registrados');
}