import { getActorFlag, selectCharacteristic, setActorFlag, TODO } from "../../../scripts/utils/utils.mjs";
import { OnClickEventType } from "../../enums/characteristic-enums.mjs";
import { SheetMethods } from "./sheet-methods.mjs";
import { traitMethods } from "./trait-methods.mjs";

class Setor0ActorSheet extends ActorSheet {

    #mapEvents = {
        trait: traitMethods
    };

    constructor(...args) {
        super(...args)
        this.currentPage = 1;
    }

    activateListeners(html) {
        super.activateListeners(html);
        this._dinamicSheet(html);
        this._presetSheet(html);
        this._setupListeners(html);
        this._addPageButtonsOnFloatingMenu(html);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["setor0OSubmundo", "sheet", "actor"],
            template: "systems/setor0OSubmundo/templates/actors/actor-sheet.hbs",
            width: 600,
            height: 860,
            resizable: false,
        });
    }

    getData() {
        const data = super.getData();
        data.editable = this.isEditable;
        data.canRoll = game.user.isGM || this.actor.isOwner;
        data.canEdit = game.user.isGM || this.actor.isOwner;
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
        const actions = [
            { selector: '#edit-mode-toggle', method: this._toggleEditMode },
            { selector: '#roll-button', method: this._openRollDialog },
            { selector: `[data-action="${OnClickEventType.CHARACTERISTIC.id}"]`, method: this._characteristicOnClick },
            { selector: `[data-action="${OnClickEventType.ADD.id}"]`, method: this._onActionClick },
            { selector: `[data-action="${OnClickEventType.REMOVE.id}"]`, method: this._onActionClick },
            { selector: `[data-action="${OnClickEventType.EDIT.id}"]`, method: this._onActionClick },
            { selector: `[data-action="${OnClickEventType.VIEW.id}"]`, method: this._onActionClick },
            { selector: `[data-action="${OnClickEventType.CHAT.id}"]`, method: this._onActionClick },
        ];

        actions.forEach(action => {
            html.find(action.selector).click(action.method.bind(this, html));
        });
    }

    _addPageButtonsOnFloatingMenu(html) {
        const buttonContainer = html.find("#floating-menu")[0];
        const pages = [];
        const buttons = [];
        html.find(".S0-page").each((index, page) => {
            pages.push(page);

            const button = document.createElement("li");
            button.textContent = page?.getAttribute('data-label') || "[Erro]";
            button.classList = 'S0-simulate-button';

            buttonContainer.appendChild(button);

            buttons.push(button);
            button.addEventListener('click', this._changePage.bind(this, index + 1, pages, buttons));

            if (index + 1 != this.currentPage) {
                page.classList.add('hidden');
            } else {
                button.classList.add('selected');
            }
        });
    }

    _toggleEditMode(html, event) {
        let currentValue = getActorFlag(this.actor, "editable");
        currentValue = !currentValue;

        setActorFlag(this.actor, "editable", currentValue)
            .then(() => this.render());
    }

    _presetSheet(html) {
        html.find('.selected').removeClass('selected');

        const system = this.actor.system;

        [
            {
                container: html.find('#atributosContainer')[0],
                systemCharacteristic: system.atributos
            },
            {
                container: html.find('#repertorioContainer')[0],
                systemCharacteristic: system.repertorio
            },
            {
                container: html.find('#virtudesContainer')[0],
                systemCharacteristic: system.virtudes
            },
            {
                container: html.find('#habilidadesContainer')[0],
                systemCharacteristic: system.habilidades
            },
            {
                container: html.find('#famaContainer')[0],
                systemCharacteristic: system
            }
        ].forEach((element) => {
            let hasNext = element.container.firstElementChild;
            while (hasNext) {
                selectCharacteristic(hasNext.children[element.systemCharacteristic[hasNext.id]]);
                hasNext = hasNext.nextElementSibling;
            }
        });
    }

    async _characteristicOnClick(html, event) {
        const element = event.target;
        selectCharacteristic(element);

        const characteristicType = event.currentTarget.dataset.characteristic;
        const systemCharacteristic = SheetMethods.characteristicTypeMap[characteristicType];

        if (systemCharacteristic) {
            const parentElement = element.parentElement;
            const level = Array.from(parentElement.children).filter(el => el.classList.contains('selected')).length;

            const characteristic = {
                [`${systemCharacteristic}.${parentElement.id}`]: level
            };

            await this.actor.update(characteristic);
        }

        TODO('ADICIONAR LINGUA')
        //TODO: ADICIONAR LINGUA
        // const element = event.target;
        // selectCharacteristic(element);

        // const characteristicType = event.currentTarget.dataset.characteristic;
        // const systemCharacteristic = SheetMethods.characteristicTypeMap[characteristicType];

        // if (systemCharacteristic) {
        //     const parentElement = element.parentElement;
        //     const checked = Array.from(parentElement.children).filter(el => el.classList.contains('selected')).length > 0;

        //     const a = [...this.actor.system.linguas]
        //     if (checked) {
        //         a.push(parentElement.id);
        //     } else {
        //         a.pop(parentElement.id);
        //     }

        //     const characteristic = {
        //         [`${systemCharacteristic}`]: a
        //     };

        //     await this.actor.update(characteristic);
        // }
    }

    async _onActionClick(html, event) {
        event.preventDefault();
        const characteristic = event.currentTarget.dataset.characteristic;
        const action = event.currentTarget.dataset.action;
        const method = this.#mapEvents[characteristic][action];
        if (method) {
            method(this.actor, event);
        } else {
            console.warn(`[${action}] não existe para: [${characteristic}]`)
        }
    }

    async _openRollDialog(html, event) {
        SheetMethods._openRollDialog(this.actor);
    }

    async _changePage(pageIndex, pages, buttons, event) {
        if (pageIndex == this.currentPage)
            return;

        const normalizedCurrentIndex = Math.max(this.currentPage - 1, 0);
        const normalizedIndex = Math.max(pageIndex - 1, 0);
        pages[normalizedCurrentIndex].classList.toggle('hidden');
        pages[normalizedIndex].classList.toggle('hidden');

        buttons[normalizedCurrentIndex].classList.toggle('selected');
        buttons[normalizedIndex].classList.toggle('selected');
        this.currentPage = pageIndex;
    }
}

export function actorHtmlTemplateRegister() {
    configureTemplates();
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("Setor 0", Setor0ActorSheet, { makeDefault: true });
    console.log('Modelos de dados e fichas registrados');
}

async function configureTemplates() {
    await loadTemplates([
        "actors/characteristics",
        "actors/biography",
        "actors/biography-trait-partial",
        "actors/status",
    ].map(item => `systems/setor0OSubmundo/templates/${item}.hbs`));

    const partials = [
        { call: 'traitPartialContainer', path: 'actors/biography-trait-partial' }
    ];

    const results = await Promise.all(partials.map(async ({ call, path }) => {
        const fullPath = `systems/setor0OSubmundo/templates/${path}.hbs`;

        if (!Handlebars.partials[fullPath]) {
            return { Partial: call, Status: "Falha (não encontrado)", Path: fullPath };
        }

        Handlebars.registerPartial(call, Handlebars.partials[fullPath]);
        return { Partial: call, Status: "Sucesso", Path: fullPath };
    }));

    console.table(results);
}