import { _createLi } from "../../../../scripts/creators/jscript/element-creator-jscript.mjs";
import { getActorFlag, selectCharacteristic, TODO } from "../../../../scripts/utils/utils.mjs";
import { OnEventType } from "../../../enums/on-event-type.mjs";
import { SheetMethods } from "./methods/sheet-methods.mjs";
import { enhancementHandleMethods, selectLevelOnOptions, updateEnhancementLevelsOptions } from "./methods/enhancement-methods.mjs";
import { EquipmentType } from "../../../enums/equipment-enums.mjs";
import { FlagsUtils } from "../../../utils/flags-utils.mjs";

class Setor0ActorSheet extends ActorSheet {

    #mapEvents = {
        sheet: SheetMethods.handleMethods.sheet,
        trait: SheetMethods.handleMethods.trait,
        enhancement: enhancementHandleMethods,
        linguas: SheetMethods.handleMethods.language,
        effects: SheetMethods.handleMethods.effects,
        temporary: SheetMethods.handleMethods.temporary,
        equipment: SheetMethods.handleMethods.equipment
    };

    constructor(...args) {
        super(...args);
        this.currentPage = 1;
        this.filterBag = EquipmentType.UNKNOWM;
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
            height: 880,
            resizable: false,
        });
    }

    getData() {
        const data = super.getData();
        data.editable = this.isEditable;
        data.canRoll = this.canRollOrEdit;
        data.canEdit = this.canRollOrEdit;
        return data;
    }

    get isEditable() {
        return getActorFlag(this.actor, "editable") && this.canRollOrEdit;
    }

    get canRollOrEdit() {
        return game.user.isGM || this.actor.isOwner;
    }

    #setupListeners(html) {
        const actionsClick = [
            { selector: '#roll-button', method: this.#openRollDialog },
            { selector: `[data-action="${OnEventType.CHARACTERISTIC}"]`, method: this.#onCharacteristicClick },
            ...Object.values(OnEventType)
                .filter(eventType => eventType !== OnEventType.CHANGE && eventType !== OnEventType.CHARACTERISTIC)
                .map(eventType => ({
                    selector: `[data-action="${eventType}"]`,
                    method: this.#onActionClick
                }))
        ];
        const actionsChange = [
            { selector: `[data-action="${OnEventType.CHANGE}"]`, method: this.#onChange },
        ];
        TODO('mudar de CHECK para CONTEXTUAL')
        const actionsContextMenu = [
            { selector: `[data-action="${OnEventType.CHECK}"]`, method: this.#onContextualClick }
        ];

        actionsClick.forEach(action => {
            html.find(action.selector).click(action.method.bind(this, html));
        });
        actionsChange.forEach(action => {
            html.find(action.selector).change(action.method.bind(this, html));
        });
        actionsContextMenu.forEach(action => {
            html.find(action.selector).on('contextmenu', action.method.bind(this, html));
        });
    }

    #addPageButtonsOnFloatingMenu(html) {
        const buttonContainer = html.find("#floating-menu")[0];
        const pages = [];
        const buttons = [];
        html.find(".S0-page").each((index, page) => {
            pages.push(page);

            const textContent = page?.getAttribute('data-label') || "[Erro]";

            const iconClass = page?.getAttribute('data-icon');
            const iconOption = iconClass ? { icon: { class: iconClass, marginRight: '4px', } } : {};

            const options = {
                classList: 'S0-simulate-button',
                ...iconOption
            };

            const button = _createLi(textContent, options);

            buttonContainer.appendChild(button);

            buttons.push(button);
            button.addEventListener('click', this.#changePage.bind(this, index + 1, pages, buttons));

            if (index + 1 != this.currentPage) {
                page.classList.add('hidden');
            } else {
                button.classList.add('S0-selected');
            }
        });
    }

    #presetSheet(html) {
        this.#verifyDarkMode(html);
        this.#cleanSheetBeforePreset(html);

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
                container: html.find('#habilidadesContainer')[0],
                systemCharacteristic: system.habilidades
            },
            {
                container: html.find('#famaContainer')[0],
                systemCharacteristic: system
            }
        ].forEach((element) => {
            let hasNext = element.container?.firstElementChild;
            while (hasNext) {
                const children = hasNext.querySelectorAll('.S0-characteristic');
                const level = element.systemCharacteristic[hasNext.id];
                selectCharacteristic(children[Math.min(level - 1, children.length - 1)]);
                hasNext = hasNext.nextElementSibling;
            }
        });

        const virtueContainer = html.find('#virtudesContainer')[0];
        let virtueElementChild = virtueContainer.firstElementChild;
        while (virtueElementChild) {
            selectCharacteristic(virtueElementChild.children[system.virtudes[virtueElementChild.id].level]);
            virtueElementChild = virtueElementChild.nextElementSibling;
        }

        this.#presetLanguages(html);
        this.#presetEnhancement(html);
        this.#presetStatus(html);
    }

    #verifyDarkMode(html) {
        const actualMode = FlagsUtils.getGameUserFlag(game.user, 'darkMode') || false;

        const parent = html.parent()[0];
        parent.classList.toggle('S0-page-transparent', actualMode);
        parent.style.margin = '0';
        parent.style.padding = '0px 2px 0px 12px';
        parent.style.overflowY = 'scroll';
    }

    #cleanSheetBeforePreset(html) {
        const classesToRemove = [
            'S0-selected', 'S0-superficial', 'S0-letal'
        ];
        for (const item of classesToRemove) {
            html.find(`.${item}`).removeClass(item);
        }
        console.info('REMOVENDO TODOS OS ELEMENTOS COM S0-selected, S0-superficial e S0-letal');
    }

    #presetLanguages(html) {
        const system = this.actor.system;
        const langContainer = html.find('#linguasContainer')[0].children;
        const langElements = Array.from(langContainer);
        system.linguas.forEach(language => {
            const langElement = langElements.find(el => el.id === language)?.querySelector('.S0-characteristic');

            if (langElement) {
                selectCharacteristic(langElement);
            }
        });
    }

    #presetEnhancement(html) {
        const system = this.actor.system;
        const activeEffects = this.actor.statuses;

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

    #presetStatus(html) {
        const system = this.actor.system;
        selectCharacteristic(html.find('#statusPage #consciencia .S0-characteristic')[system.virtudes.consciencia.used - 1]);
        selectCharacteristic(html.find('#statusPage #perseveranca .S0-characteristic')[system.virtudes.perseveranca.used - 1]);
        selectCharacteristic(html.find('#statusPage #quietude .S0-characteristic')[system.virtudes.quietude.used - 1]);
        selectCharacteristic(html.find('#statusPage #sobrecarga .S0-characteristic')[system.sobrecarga - 1]);

        const life = html.find('#statusPage #vida .S0-characteristic');
        life.addClass('S0-selected');
        selectCharacteristic(life[system.vida]);

        let letalDamage = system.vitalidade.dano_letal || 0;
        let superFicialDamage = system.vitalidade.dano_superficial || 0;
        html.find('#vitalidade .S0-characteristic-temp').each((index, item) => {
            if (superFicialDamage > 0) {
                item.classList.add('S0-superficial');
                superFicialDamage--;
            } else if (letalDamage > 0) {
                item.classList.add('S0-letal');
                letalDamage--;
            } else {
                return;
            }
        });
    }

    async #onCharacteristicClick(html, event) {
        SheetMethods._handleCharacteristicClickEvent(event, this.actor);
    }

    async #onActionClick(html, event) {
        this.#onEvent(event.currentTarget.dataset.action, html, event);
    }

    async #onChange(html, event) {
        this.#onEvent('change', html, event);
    }

    async #onContextualClick(html, event) {
        this.#onEvent('contextual', html, event);
    }

    async #onEvent(action, html, event) {
        event.preventDefault();
        const characteristic = event.currentTarget.dataset.characteristic;
        const method = this.#mapEvents[characteristic]?.[action];
        if (method) {
            method(this.actor, event);
        } else {
            console.warn(`-> [${action}] não existe para: [${characteristic}]`);
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

        buttons[normalizedCurrentIndex].classList.toggle('S0-selected');
        buttons[normalizedIndex].classList.toggle('S0-selected');
        this.currentPage = pageIndex;
    }
}

export async function actorHtmlTemplateRegister() {
    await configurePartialTemplates();
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("setor0OSubmundo", Setor0ActorSheet, { makeDefault: true });
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
        "actors/equipment",
        "actors/equipment-bag-item",
        "actors/equipment-equipped-item",
    ].map(item => `systems/setor0OSubmundo/templates/${item}.hbs`));

    const partials = [
        { call: 'traitPartialContainer', path: 'actors/biography-trait-partial' },
        { call: 'equipamentBagItem', path: 'actors/equipment-bag-item' },
        { call: 'equipamentEquippedItem', path: 'actors/equipment-equipped-item' },
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