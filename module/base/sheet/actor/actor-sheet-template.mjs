import { _createLi } from "../../../creators/element/element-creator-jscript.mjs";
import { getObject, selectCharacteristic } from "../../../../scripts/utils/utils.mjs";
import { OnEventType, OnEventTypeClickableEvents, OnEventTypeContextualEvents, OnMethod, verifyAndParseOnEventType } from "../../../enums/on-event-type.mjs";
import { SheetMethods } from "./methods/sheet-methods.mjs";
import { selectLevelOnOptions, updateEnhancementLevelsOptions } from "./methods/enhancement-methods.mjs";
import { EquipmentType } from "../../../enums/equipment-enums.mjs";
import { FlagsUtils } from "../../../utils/flags-utils.mjs";
import { BaseActorCharacteristicType, CharacteristicType } from "../../../enums/characteristic-enums.mjs";
import { HtmlJsUtils } from "../../../utils/html-js-utils.mjs";
import { loadAndRegisterTemplates } from "../../../utils/templates.mjs";
import { SYSTEM_ID } from "../../../constants.mjs";
import { SheetActorDragabbleMethods } from "./methods/dragabble-methods.mjs";
import { SystemFlags } from "../../../enums/flags-enums.mjs";
import { ActorUtils } from "../../../core/actor/actor-utils.mjs";

class Setor0ActorSheet extends ActorSheet {

    #mapEvents = {
        menu: SheetMethods.handleMethods.menu,
        trait: SheetMethods.handleMethods.trait,
        enhancement: SheetMethods.handleMethods.enhancement,
        language: SheetMethods.handleMethods.language,
        effects: SheetMethods.handleMethods.effects,
        temporary: SheetMethods.handleMethods.temporary,
        equipment: SheetMethods.handleMethods.equipment,
        shortcuts: SheetMethods.handleMethods.shortcuts,
        allies: SheetMethods.handleMethods.allies,
        informants: SheetMethods.handleMethods.informants,
    };

    constructor(...args) {
        super(...args);
        this.currentPage = 1;
        this.filterBag = EquipmentType.UNKNOWM;
        this.isExpandedEffects = undefined;
        this.isExpandedShortcuts = undefined;
        this.defaultHeight = undefined;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "actor"],
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

    async _onDropActor(event, data) {
        console.log('-> On Drop Actor');
    }

    async _onDropItem(event, data) {
        console.log('-> On Drop Item');
    }

    get isEditable() {
        return FlagsUtils.getActorFlag(this.actor, "editable") && this.canRollOrEdit;
    }

    get canRollOrEdit() {
        return game.user.isGM || this.actor.isOwner;
    }

    activateListeners(html) {
        super.activateListeners(html);
        this.setupContentAndHeader(html);
        this.#presetSheet(html);
        this.#setupListeners(html);
        this.#addPageButtonsOnFloatingMenu(html);
        SheetActorDragabbleMethods.setup(html, this.actor);
    }

    setupContentAndHeader(html) {
        HtmlJsUtils.setupContent(html);
        HtmlJsUtils.setupHeader(html);
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

        const isCompacted = FlagsUtils.getItemFlag(game.user, SystemFlags.MODE.COMPACT)

        html.find(".S0-page").each((index, page) => {
            pages.push(page);

            const pageLabel = page?.getAttribute('data-label') || "[Erro]";
            const textContent = isCompacted ? undefined : pageLabel;

            const iconClass = page?.getAttribute('data-icon');
            const iconOption = iconClass ? { icon: { class: iconClass, marginRight: isCompacted ? '0px' : '4px', } } : {};

            const options = {
                title: pageLabel,
                classList: `S0-simulate-button ${isCompacted ? 'S0-compact' : ''}`,
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
        const actor = this.actor;
        [
            {
                container: html.find('#atributosContainer')[0],
                systemCharacteristic: getObject(actor, CharacteristicType.ATTRIBUTES)
            },
            {
                container: html.find('#repertorioContainer')[0],
                systemCharacteristic: getObject(actor, CharacteristicType.REPERTORY)
            },
            {
                container: html.find('#skillsContainer')[0],
                systemCharacteristic: getObject(actor, CharacteristicType.SKILLS)
            },
            {
                container: html.find('#fameContainer')[0],
                systemCharacteristic: getObject(actor, CharacteristicType.SIMPLE)
            }
        ].forEach(({ container, systemCharacteristic }) => {
            let hasNext = container?.firstElementChild;
            while (hasNext) {
                const children = hasNext.querySelectorAll('.S0-characteristic');
                const level = systemCharacteristic[hasNext.id];
                selectCharacteristic(children[Math.min(level - 1, children.length - 1)]);
                hasNext = hasNext.nextElementSibling;
            }
        });

        const virtueContainer = html.find('#virtudesContainer')[0];
        let virtueElementChild = virtueContainer.firstElementChild;
        while (virtueElementChild) {
            const virtueLevel = ActorUtils.getVirtueLevel(actor, virtueElementChild.id);
            selectCharacteristic(virtueElementChild.children[virtueLevel]);
            virtueElementChild = virtueElementChild.nextElementSibling;
        }

        this.#presetLanguages(html);
        this.#presetEnhancement(html);
        this.#presetStatus(html);
        this.#presetSheetExpandContainers(html);
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
        const actor = this.actor;

        function select(id, characteristic) {
            const value = getObject(actor, characteristic) || 0;
            selectCharacteristic(html.find(`#statusPage #${id} .S0-characteristic`)[value - 1]);
        }

        select('consciencia', CharacteristicType.VIRTUES.CONSCIOUSNESS.USED);
        select('perseveranca', CharacteristicType.VIRTUES.PERSEVERANCE.USED);
        select('quietude', CharacteristicType.VIRTUES.QUIETNESS.USED);
        select('sobrecarga', CharacteristicType.OVERLOAD);
        select('vida', CharacteristicType.LIFE);

        let letalDamage = getObject(actor, BaseActorCharacteristicType.VITALITY.LETAL_DAMAGE) || 0;
        let superFicialDamage = getObject(actor, BaseActorCharacteristicType.VITALITY.SUPERFICIAL_DAMAGE) || 0;
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
        this.#verifyAndExpandContainers(effectsContainer, isExpandedEffects, html);

        const shortcutsContainer = html.find(`#shortcuts-container-${this.actor.id}`);
        if (!shortcutsContainer) {
            return
        }

        const isExpandedShortcuts = this.isExpandedShortcuts;
        this.#verifyAndExpandContainers(shortcutsContainer, isExpandedShortcuts, html);

        if (!this.defaultHeight || isExpandedEffects === undefined || isExpandedShortcuts == undefined) {
            requestAnimationFrame(() => {
                const content = html.parent().parent()[0];
                const windowElem = content.closest(".window-app");
                this.defaultHeight = windowElem?.offsetHeight;

                this.isExpandedEffects = effectsContainer[0].classList.contains('S0-expanded');
                this.isExpandedShortcuts = shortcutsContainer[0].classList.contains('S0-expanded');
            });
        }
    }

    #verifyAndExpandContainers(container, isExpanded, html) {
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

export async function actorTemplatesRegister() {
    const templates = [
        { path: "actors/characteristics" },
        { path: "actors/biography" },
        { path: "actors/biography-trait-partial", call: 'traitPartialContainer' },
        { path: "actors/status" },
        { path: "actors/enhancement" },
        { path: "actors/enhancement-partial" },
        { path: "actors/equipment" },
        { path: "items/equipment-bag-item", call: 'equipamentBagItem' },
        { path: "items/equipment-equipped-item", call: 'equipamentEquippedItem' },
        { path: "actors/shortcuts" },
        { path: "actors/shortcut-default-partial", call: 'shortcutDefaultPartial' },
        { path: "actors/network" },
        { path: "actors/network-partial", call: 'networkPartial' },
    ];

    return await loadAndRegisterTemplates(templates);;
}

export async function registerActor() {
    await Actors.unregisterSheet("core", ActorSheet);
    await Actors.registerSheet(SYSTEM_ID, Setor0ActorSheet, {
        types: ["Player"],
        makeDefault: true
    });
}