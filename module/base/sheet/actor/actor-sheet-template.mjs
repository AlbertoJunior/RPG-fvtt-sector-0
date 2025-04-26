import { _createLi } from "../../../creators/element/element-creator-jscript.mjs";
import { getActorFlag, getObject, selectCharacteristic } from "../../../../scripts/utils/utils.mjs";
import { OnEventType, OnEventTypeClickableEvents, OnEventTypeContextualEvents, OnMethod, verifyAndParseOnEventType } from "../../../enums/on-event-type.mjs";
import { SheetMethods } from "./methods/sheet-methods.mjs";
import { selectLevelOnOptions, updateEnhancementLevelsOptions } from "./methods/enhancement-methods.mjs";
import { EquipmentType } from "../../../enums/equipment-enums.mjs";
import { FlagsUtils } from "../../../utils/flags-utils.mjs";
import { REGISTERED_TEMPLATES } from "../../../constants.mjs";
import { CharacteristicType } from "../../../enums/characteristic-enums.mjs";
import { HtmlJsUtils } from "../../../utils/html-js-utils.mjs";

class Setor0ActorSheet extends ActorSheet {

    #mapEvents = {
        sheet: SheetMethods.handleMethods.sheet,
        trait: SheetMethods.handleMethods.trait,
        enhancement: SheetMethods.handleMethods.enhancement,
        linguas: SheetMethods.handleMethods.language,
        effects: SheetMethods.handleMethods.effects,
        temporary: SheetMethods.handleMethods.temporary,
        equipment: SheetMethods.handleMethods.equipment,
        shortcuts: SheetMethods.handleMethods.shortcuts,
    };

    constructor(...args) {
        super(...args);
        this.currentPage = 1;
        this.filterBag = EquipmentType.UNKNOWM;
        this.isExpandedEffects = undefined;
        this.isExpandedShortcuts = undefined;
        this.defaultHeight = undefined;
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
            { selector: `[data-action="${OnEventType.CHARACTERISTIC}"]`, method: this.#onCharacteristicClick },
            ...OnEventTypeClickableEvents.map(eventType => ({ selector: `[data-action="${eventType}"]`, method: this.#onActionClick }))
        ];
        const actionsChange = [
            { selector: `[data-action="${OnEventType.CHANGE}"]`, method: this.#onChange },
        ];
        const actionsContextMenu = [
            ...OnEventTypeContextualEvents.map(eventType => ({ selector: `[data-action="${eventType}"]`, method: this.#onContextualClick }))
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
        this.#presetSheetExpandContainers(html);
    }

    #verifyDarkMode(html) {
        const inDarkMode = FlagsUtils.getGameUserFlag(game.user, 'darkMode') || false;

        const parent = html.parent()[0];
        parent.classList.toggle('S0-page-transparent', inDarkMode);
        parent.style.margin = '0px';
        parent.style.padding = '0px 2px 0px 12px';
        parent.style.overflowY = 'scroll';

        if (inDarkMode) {
            const header = parent.parentElement.children[0].children;
            for (const child of header) {
                child.style.color = 'var(--primary-color)';
            }
        }
    }

    #cleanSheetBeforePreset(html) {
        const classesToRemove = [
            'S0-selected', 'S0-superficial', 'S0-letal'
        ];
        for (const item of classesToRemove) {
            html.find(`.${item}`).removeClass(item);
        }
        console.info('-> Setor0ActorSheet[actor-sheet-template]:\nREMOVENDO TODOS OS ELEMENTOS COM S0-selected, S0-superficial e S0-letal');
    }

    #presetLanguages(html) {
        const langContainer = html.find('#linguasContainer')[0].children;
        const langElements = Array.from(langContainer);

        getObject(this.actor, CharacteristicType.LANGUAGE)
            .forEach(language => {
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

    #presetSheetExpandContainers(html) {
        const effectsContainer = html.find('#effects-container');
        const isExpandedEffects = this.isExpandedEffects;
        this.#verifyAndExpandContainers(effectsContainer, isExpandedEffects);

        const shortcutsContainer = html.find('#shortcuts-container');
        const isExpandedShortcuts = this.isExpandedShortcuts;
        this.#verifyAndExpandContainers(shortcutsContainer, isExpandedShortcuts);

        if (!this.defaultHeight || isExpandedEffects === undefined) {
            requestAnimationFrame(() => {
                const content = html.parent().parent()[0];
                const windowElem = content.closest(".window-app");
                this.defaultHeight = windowElem?.offsetHeight;

                this.isExpandedEffects = effectsContainer[0].classList.contains('S0-expanded');
                this.isExpandedShortcuts = shortcutsContainer[0].classList.contains('S0-expanded');
            });
        }
    }

    #verifyAndExpandContainers(container, isExpanded) {
        if (typeof isExpanded === 'boolean') {
            container.toggleClass('S0-expanded', isExpanded);
            if (!isExpanded) {
                HtmlJsUtils.flipClasses(html.find('#effects-container-icon')[0], 'fa-chevron-up', 'fa-chevron-down');
            }
        }
    }

    async #onCharacteristicClick(html, event) {
        if (!this.isEditable) {
            return;
        }
        SheetMethods._handleCharacteristicClickEvent(event, this.actor);
    }

    async #onActionClick(html, event) {
        const action = verifyAndParseOnEventType(event.currentTarget.dataset.action, OnMethod.CLICK);
        this.#onEvent(action, html, event);
    }

    async #onChange(html, event) {
        this.#onEvent(OnEventType.CHANGE, html, event);
    }

    async #onContextualClick(html, event) {
        const action = verifyAndParseOnEventType(event.currentTarget.dataset.action, OnMethod.CONTEXTUAL);
        this.#onEvent(action, html, event);
    }

    async #onEvent(action, html, event) {
        event.preventDefault();
        const characteristic = event.currentTarget.dataset.characteristic;
        const method = this.#mapEvents[characteristic]?.[action];
        if (method) {
            method(this.actor, event, html);
        } else {
            console.warn(`-> [${action}] não existe para: [${characteristic}]`);
        }
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
    await Actors.unregisterSheet("core", ActorSheet);
    await Actors.registerSheet("setor0OSubmundo", Setor0ActorSheet, { makeDefault: true });
}

async function configurePartialTemplates() {
    const actorTemplateNames = [
        "characteristics",
        "biography",
        "biography-trait-partial",
        "status",
        "enhancement",
        "enhancement-partial",
        "equipment",
        "equipment-bag-item",
        "equipment-equipped-item",
        "shortcuts",
        "shortcut-default-partial"
    ];

    const actorTemplatePaths = actorTemplateNames.map(name =>
        `systems/setor0OSubmundo/templates/actors/${name}.hbs`
    );

    await loadTemplates(actorTemplatePaths);

    for (const path of actorTemplatePaths) {
        REGISTERED_TEMPLATES.add(path);
    }

    const partials = [
        { call: 'traitPartialContainer', path: 'biography-trait-partial' },
        { call: 'equipamentBagItem', path: 'equipment-bag-item' },
        { call: 'equipamentEquippedItem', path: 'equipment-equipped-item' },
        { call: 'shortcutDefaultPartial', path: 'shortcut-default-partial' },
    ];

    const results = await Promise.all(partials.map(async ({ call, path }) => {
        const fullPath = `systems/setor0OSubmundo/templates/actors/${path}.hbs`;

        if (!Handlebars.partials[fullPath]) {
            return { Partial: call, Status: "Falha (não encontrado)", Path: fullPath };
        }

        Handlebars.registerPartial(call, Handlebars.partials[fullPath]);
        return { Partial: call, Status: "Sucesso", Path: fullPath };
    }));

    const errors = results.filter(r => r.Status !== "Sucesso").length;
    if (errors > 0) {
        console.error(`Erros [${errors}] ao carregar partials.`);
    }
    console.table(results);
}