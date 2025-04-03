import { _createLi } from "../../../scripts/creators/jscript/element-creator-jscript.mjs";
import { getActorFlag, selectCharacteristic, setActorFlag } from "../../../scripts/utils/utils.mjs";
import { OnEventType } from "../../enums/characteristic-enums.mjs";
import { enhancementHandleMethods, selectLevelOnOptions, updateEnhancementLevelsOptions } from "./enhancement-methods.mjs";
import { SheetMethods } from "./sheet-methods.mjs";
import { traitMethods } from "./trait-methods.mjs";

class Setor0ActorSheet extends ActorSheet {

    #mapEvents = {
        trait: traitMethods,
        enhancement: enhancementHandleMethods,
        linguas: SheetMethods.handleMethods.language,
        effects: SheetMethods.handleMethods.effects,
    };

    constructor(...args) {
        super(...args)
        this.currentPage = 1;
    }

    activateListeners(html) {
        super.activateListeners(html);
        SheetMethods._createDynamicSheet(html, this.isEditable);
        this.#presetSheet(html);
        this.#setupListeners(html);
        this.#addPageButtonsOnFloatingMenu(html);
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

    #setupListeners(html) {
        const actionsClick = [
            { selector: '#edit-mode-toggle', method: this.#toggleEditMode },
            { selector: '#roll-button', method: this.#openRollDialog },
            { selector: `[data-action="${OnEventType.CHARACTERISTIC.id}"]`, method: this.#characteristicOnClick },
            ...Object.values(OnEventType)
                .filter(eventType => eventType !== OnEventType.CHANGE && eventType !== OnEventType.CHARACTERISTIC)
                .map(eventType => ({
                    selector: `[data-action="${eventType.id}"]`,
                    method: this.#onActionClick
                }))
        ];
        const actionsChange = [
            { selector: `[data-action="${OnEventType.CHANGE.id}"]`, method: this.#onChange },
        ];

        actionsClick.forEach(action => {
            html.find(action.selector).click(action.method.bind(this, html));
        });
        actionsChange.forEach(action => {
            html.find(action.selector).change(action.method.bind(this, html));
        });
    }

    #addPageButtonsOnFloatingMenu(html) {
        const buttonContainer = html.find("#floating-menu")[0];
        const pages = [];
        const buttons = [];
        html.find(".S0-page").each((index, page) => {
            pages.push(page);

            const textContent = page?.getAttribute('data-label') || "[Erro]";
            const button = _createLi(textContent, { classList: 'S0-simulate-button' });

            buttonContainer.appendChild(button);

            buttons.push(button);
            button.addEventListener('click', this.#changePage.bind(this, index + 1, pages, buttons));

            if (index + 1 != this.currentPage) {
                page.classList.add('hidden');
            } else {
                button.classList.add('selected');
            }
        });
    }

    async #toggleEditMode(html, event) {
        let currentValue = getActorFlag(this.actor, "editable");
        currentValue = !currentValue;

        await setActorFlag(this.actor, "editable", currentValue)
    }

    #presetSheet(html) {
        html.find('.selected').removeClass('selected');

        const system = this.actor.system;
        const activeEffects = this.actor.statuses;

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
                const children = hasNext.children;
                selectCharacteristic(children[Math.min(element.systemCharacteristic[hasNext.id], children.length - 1)]);
                hasNext = hasNext.nextElementSibling;
            }
        });

        const virtueContainer = html.find('#virtudesContainer')[0];
        let virtueElementChild = virtueContainer.firstElementChild;
        while (virtueElementChild) {
            selectCharacteristic(virtueElementChild.children[system.virtudes[virtueElementChild.id].level]);
            virtueElementChild = virtueElementChild.nextElementSibling;
        }

        const langContainer = html.find('#linguasContainer')[0].children;
        const langElements = Array.from(langContainer);
        system.linguas.forEach(language => {
            const langElement = langElements.find(el => el.id === language)?.querySelector('.S0-characteristic');

            if (langElement) {
                selectCharacteristic(langElement);
            }
        });

        html.find('.S0-enhancement').each((index, enhaceContainer) => {
            const enhancement = system.aprimoramentos[`aprimoramento_${index + 1}`];
            const selects = $(enhaceContainer).find('select');

            $(selects[0]).find('option').each((_, option) => {
                const itemId = option.dataset.itemId;
                if (itemId == enhancement.id) {
                    option.selected = true;
                    const levelSelects = selects.slice(1);
                    updateEnhancementLevelsOptions(itemId, levelSelects);
                    selectLevelOnOptions(enhancement, levelSelects, activeEffects);
                }
            });
        });
    }

    async #characteristicOnClick(html, event) {
        const element = event.target;
        selectCharacteristic(element);

        const characteristicType = event.currentTarget.dataset.characteristic;
        const systemCharacteristic = SheetMethods.characteristicTypeMap[characteristicType];

        if (systemCharacteristic) {
            const parentElement = element.parentElement;
            const level = Array.from(parentElement.children).filter(el => el.classList.contains('selected')).length;

            let characteristic;
            if (systemCharacteristic.includes('virtudes')) {
                characteristic = {
                    [`${systemCharacteristic}.${parentElement.id}.level`]: level
                };
            } else {
                characteristic = {
                    [`${systemCharacteristic}.${parentElement.id}`]: level
                };
            }

            await this.actor.update(characteristic);
        }
    }

    async #onActionClick(html, event) {
        event.preventDefault();
        const characteristic = event.currentTarget.dataset.characteristic;
        const action = event.currentTarget.dataset.action;
        const method = this.#mapEvents[characteristic]?.[action];
        if (method) {
            method(this.actor, event);
        } else {
            console.warn(`-> [${action}] não existe para: [${characteristic}]`);
        }
    }

    async #onChange(html, event) {
        event.preventDefault();
        const characteristic = event.currentTarget.dataset.characteristic;
        const method = this.#mapEvents[characteristic]?.['change'];
        if (method) {
            method(this.actor, event);
        } else {
            console.warn(`-> ['change'] não existe para: [${characteristic}]`);
        }
    }

    async #openRollDialog(html, event) {
        SheetMethods._openRollDialog(this.actor);
    }

    async #changePage(pageIndex, pages, buttons, event) {
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

export async function actorHtmlTemplateRegister() {
    await configurePartialTemplates();
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("Setor 0", Setor0ActorSheet, { makeDefault: true });
    console.log('-> Modelos de dados e fichas registrados');
}

async function configurePartialTemplates() {
    await loadTemplates([
        "actors/characteristics",
        "actors/biography",
        "actors/biography-trait-partial",
        "actors/status",
        "actors/enhancement",
        "actors/enhancement-partial",
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