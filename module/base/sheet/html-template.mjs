import { getActorFlag, selectCharacteristic, setActorFlag } from "../../../scripts/utils/utils.mjs";
import { SheetMethods } from "./sheet-methods.mjs";

class Setor0ActorSheet extends ActorSheet {

    constructor(...args) {
        super(...args)
        this.currentPage = 1;
    }

    activateListeners(html) {
        super.activateListeners(html);
        this._dinamicSheet(html);
        this._presetSheet(html);
        this._setupListeners(html);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["setor0OSubmundo", "sheet", "actor"],
            template: "systems/setor0OSubmundo/templates/actors/actor-sheet.hbs",
            width: 600,
            height: 900
        });
    }

    getData() {
        const data = super.getData();
        data.editable = this.isEditable;
        data.canRoll = game.user.isGM || this.actor.isOwner;
        data.canEdit = game.user.isGM || this.actor.isOwner;

        console.log(data)
        return data;
    }

    get isEditable() {
        return getActorFlag(this.actor, "editable");
    }

    get canEdit() {
        return getActorFlag(this.actor, "canEdit");
    }

    get canRoll() {
        return getActorFlag(this.actor, "canRoll");
    }

    _dinamicSheet(html) {
        SheetMethods._createDinamicSheet(html, this.isEditable);
    }

    _setupListeners(html) {
        html.find('#edit-mode-toggle').click(this._toggleEditMode.bind(this));
        html.find('[data-action="characteristicOnClick"]').click(this._characteristicOnClick.bind(this));
        html.find("#roll-button").click(this._openRollDialog.bind(this));

        const pages = [];
        html.find(".S0-page").each((index, element) => {
            if (index + 1 != this.currentPage) {
                element.classList.add('hidden');
            }
            pages.push(element);
        });
        const buttons = html.find(".page-button");
        buttons.each((index, element) => {
            if (index + 1 == this.currentPage) {
                element.classList.toggle('selected');
            }
            if (index < pages.length)
                element.addEventListener('click', this._changePage.bind(this, index + 1, pages, buttons));
        });
    }

    _toggleEditMode(event) {
        event.preventDefault();

        let currentValue = getActorFlag(this.actor, "editable");
        currentValue = !currentValue;

        setActorFlag(this.actor, "editable", currentValue)
            .then(() => this.render());
    }

    _presetSheet(html) {
        const system = this.actor.system;

        const preselecteds = html.find('.selected');
        preselecteds.removeClass('selected');

        const atributoElementos = html.find('#atributosContainer')[0];
        let hasNext = atributoElementos.firstElementChild;
        while (hasNext) {
            selectCharacteristic(hasNext.children[system.atributos[hasNext.id]]);
            hasNext = hasNext.nextElementSibling;
        }
    }

    async _characteristicOnClick(event) {
        event.preventDefault();

        const element = event.target;
        selectCharacteristic(element);

        const parentElement = element.parentElement;
        const level = Array.from(parentElement.children).filter(el => el.classList.contains('selected')).length;

        const characteristic = {};
        characteristic[`system.atributos.${parentElement.id}`] = level;
        await this.actor.update(characteristic);
    }

    async _openRollDialog(event) {
        event.preventDefault();
        SheetMethods._openRollDialog(this.actor);
    }

    async _changePage(pageIndex, pages, buttons, event) {
        event.preventDefault();
        if (pageIndex == this.currentPage)
            return;

        const normalizedCurrentIndex = Math.max(this.currentPage - 1, 0);
        const normalizedIndex = Math.max(pageIndex - 1, 0);
        pages[normalizedCurrentIndex].classList.toggle('hidden');
        pages[normalizedIndex].classList.toggle('hidden');
        
        buttons[normalizedCurrentIndex].classList.toggle('selected');
        buttons[normalizedIndex].classList.toggle('selected');
        console.log(buttons[normalizedIndex].classList)
        this.currentPage = pageIndex;
        //this.render();
    }
}

export function htmlTemplateRegister() {
    Actors.registerSheet("Setor 0", Setor0ActorSheet, { makeDefault: true });
    console.log('Modelos de dados e fichas registrados');
}