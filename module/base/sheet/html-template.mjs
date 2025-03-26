import { getActorFlag, selectCharacteristic, setActorFlag } from "../../../scripts/utils/utils.mjs";
import { ChangeImage } from "../change-image.mjs";
import { CharacteristicType, SheetMethods } from "./sheet-methods.mjs";

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
        this._addPageButtonsOnFloatingMenu(html);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["setor0OSubmundo", "sheet", "actor"],
            template: "systems/setor0OSubmundo/templates/actors/actor-sheet.hbs",
            width: 600,
            height: 850
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
        html.find('#edit-mode-toggle').click(this._toggleEditMode.bind(this));
        html.find('[data-action="characteristicOnClick"]').click(this._characteristicOnClick.bind(this));
        html.find("#roll-button").click(this._openRollDialog.bind(this));
    }

    _addPageButtonsOnFloatingMenu(html) {
        const buttonContainer = html.find("#floating-menu")[0];
        const pages = [];
        const buttons = [];
        html.find(".S0-page").each((index, page) => {
            pages.push(page);

            const button = document.createElement("li");
            button.textContent = page?.getAttribute('data-label') || "[Erro]";
            button.classList = 'simulate-button';

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

    async _changeImage(event) {
        event.preventDefault();
        if (this.isEditable) {
            ChangeImage._change(this.actor);
        }
    }

    _toggleEditMode(event) {
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

    async _characteristicOnClick(event) {
        const element = event.target;
        selectCharacteristic(element);

        let systemCharacteristic;
        const characteristicType = event.currentTarget.dataset.characteristic;
        switch (characteristicType) {
            case CharacteristicType.ATTRIBUTE:
                systemCharacteristic = "system.atributos"
                break;
            case CharacteristicType.ABILITY:
                systemCharacteristic = "system.habilidades"
                break;
            case CharacteristicType.VIRTUES:
                systemCharacteristic = "system.virtudes"
                break;
            case CharacteristicType.REPERTORY:
                systemCharacteristic = "system.repertorio"
                break;
            case CharacteristicType.SIMPLE:
                systemCharacteristic = "system"
                break;
            default:
                systemCharacteristic = undefined;
                break;
        }

        if (systemCharacteristic) {
            const parentElement = element.parentElement;
            const level = Array.from(parentElement.children).filter(el => el.classList.contains('selected')).length;

            const characteristic = {};
            characteristic[`${systemCharacteristic}.${parentElement.id}`] = level;
            await this.actor.update(characteristic);
        }
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
        this.currentPage = pageIndex;
    }
}

export function htmlTemplateRegister() {
    Actors.registerSheet("Setor 0", Setor0ActorSheet, { makeDefault: true });
    console.log('Modelos de dados e fichas registrados');
}