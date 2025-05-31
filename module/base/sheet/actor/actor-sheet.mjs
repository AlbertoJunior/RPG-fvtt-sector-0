import { _createLi } from "../../../creators/element/element-creator-jscript.mjs";
import { getObject, selectCharacteristic } from "../../../../scripts/utils/utils.mjs";
import { OnEventType, OnEventTypeClickableEvents, OnEventTypeContextualEvents } from "../../../enums/on-event-type.mjs";
import { SheetMethods } from "./methods/sheet-methods.mjs";
import { selectLevelOnOptions, updateEnhancementLevelsOptions } from "./methods/enhancement-methods.mjs";
import { EquipmentType } from "../../../enums/equipment-enums.mjs";
import { CharacteristicType } from "../../../enums/characteristic-enums.mjs";
import { HtmlJsUtils } from "../../../utils/html-js-utils.mjs";
import { loadAndRegisterTemplates } from "../../../utils/templates.mjs";
import { SYSTEM_ID, TEMPLATES_PATH } from "../../../constants.mjs";
import { SheetActorDragabbleMethods } from "./methods/dragabble-methods.mjs";
import { ActorUtils } from "../../../core/actor/actor-utils.mjs";
import { Setor0BaseActorSheet } from "../BaseActorSheet.mjs";
import { characteristicOnClick } from "./methods/characteristics-methods.mjs";

class Setor0ActorSheet extends Setor0BaseActorSheet {

    get mapEvents() {
        return {
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
    }

    constructor(...args) {
        super(...args);
        this.filterBag = EquipmentType.UNKNOWM;
        this.isExpandedEffects = undefined;
        this.isExpandedShortcuts = undefined;
        this.defaultHeight = undefined;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "actor"],
            template: `${TEMPLATES_PATH}/actors/actor-sheet.hbs`,
            width: 600,
            height: 880,
            resizable: false,
        });
    }

    activateListeners(html) {
        super.activateListeners(html);
        this.#presetSheet(html);
        this.#setupListeners(html);
        super.addPageButtonsOnFloatingMenu(html);
        SheetActorDragabbleMethods.setup(html, this.actor);
    }

    #setupListeners(html) {
        const actionsClick = [
            { selector: `[data-action="${OnEventType.CHARACTERISTIC}"]`, method: this.#onCharacteristicClick },
            ...OnEventTypeClickableEvents.map(eventType => ({ selector: `[data-action="${eventType}"]`, method: super.onActionClick }))
        ];
        const actionsChange = [
            { selector: `[data-action="${OnEventType.CHANGE}"]`, method: super.onChange },
        ];
        const actionsContextMenu = [
            ...OnEventTypeContextualEvents.map(eventType => ({ selector: `[data-action="${eventType}"]`, method: super.onContextualClick }))
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
        const activeEffects = this.actor.statuses;
        const actorEnhancements = Object.values(getObject(this.actor, CharacteristicType.ENHANCEMENT_ALL));

        html.find('.S0-enhancement').each((index, enhaceContainer) => {
            const enhancement = actorEnhancements[index];
            const selects = $(enhaceContainer).find('select');

            const familySelect = selects[0];
            const option = Array.from(familySelect.options).find(option => option.dataset.itemId == enhancement.id);
            if (option) {
                option.selected = true;
                const levelSelects = selects.slice(1);
                updateEnhancementLevelsOptions(enhancement.id, levelSelects);
                selectLevelOnOptions(enhancement, levelSelects, activeEffects);
            }
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

        Setor0BaseActorSheet.presetStatusVitality(html, actor);
        Setor0BaseActorSheet.presetStatusProtect(html, actor);
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
        await characteristicOnClick(event, this.actor);
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