import { ActorRollDialog } from "../../../../creators/dialog/actor-roll-dialog.mjs";
import { ElementCreatorJQuery } from "../../../../../scripts/creators/jquery/element-creator.mjs";
import { EnhancementRepository } from "../../../../repository/enhancement-repository.mjs";
import { LanguageRepository } from "../../../../repository/language-repository.mjs";
import { getActorFlag, getObject, selectCharacteristic, setActorFlag } from "../../../../../scripts/utils/utils.mjs";
import { CharacteristicType, CharacteristicTypeMap } from "../../../../enums/characteristic-enums.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { handleStatusMethods } from "./status-methods.mjs";
import { handlerEquipmentEvents } from "./equipment-methods.mjs";
import { traitMethods } from "./trait-methods.mjs";
import { characteristicOnClick } from "./characteristics-methods.mjs";
import { FlagsUtils } from "../../../../utils/flags-utils.mjs";
import { AttributeRepository } from "../../../../repository/attribute-repository.mjs";
import { AbilityRepository } from "../../../../repository/ability-repository.mjs";
import { enhancementHandleMethods } from "../methods/enhancement-methods.mjs";
import { HtmlJsUtils } from "../../../../utils/html-js-utils.mjs";

export class SheetMethods {
    static characteristicTypeMap = CharacteristicTypeMap;

    static handleMethods = {
        sheet: {
            [OnEventType.ROLL]: async (actor, event) => { ActorRollDialog._open(actor); },
            [OnEventType.CHECK]: async (actor, event) => {
                const type = event.currentTarget.dataset.type;
                switch (type) {
                    case 'color': {
                        const actualMode = FlagsUtils.getGameUserFlag(game.user, 'darkMode') || false;
                        await FlagsUtils.setGameUserFlag(game.user, 'darkMode', !actualMode);
                        actor.sheet.render();
                        return;
                    }
                    case 'edit': {
                        let currentValue = getActorFlag(actor, "editable");
                        currentValue = !currentValue;

                        setActorFlag(actor, "editable", currentValue);
                        return;
                    }
                }
            }
        },
        language: {
            [OnEventType.ADD]: async (actor, event) => {
                const element = event.target;
                selectCharacteristic(element);

                const characteristicType = event.currentTarget.dataset.characteristic;
                const systemCharacteristic = SheetMethods.characteristicTypeMap[characteristicType];

                if (systemCharacteristic) {
                    const parentElement = element.parentElement;
                    const checked = Array.from(parentElement.children).some(el => el.classList.contains('S0-selected'));

                    const updatedLanguages = getObject(actor, CharacteristicType.LANGUAGE);
                    if (checked) {
                        updatedLanguages.push(parentElement.id);
                    } else {
                        const indexToRemove = updatedLanguages.indexOf(parentElement.id);
                        if (indexToRemove !== -1) {
                            updatedLanguages.splice(indexToRemove, 1);
                        }
                    }

                    const characteristic = {
                        [`${systemCharacteristic}`]: [... new Set(updatedLanguages)]
                    };

                    await actor.update(characteristic);
                }
            }
        },
        trait: traitMethods,
        enhancement: enhancementHandleMethods,
        effects: {
            [OnEventType.REMOVE]: async (actor, event) => {
                const currentTarget = event.currentTarget;
                const removeType = currentTarget.dataset.type;
                if (removeType == 'single') {
                    const index = currentTarget.dataset.itemIndex;
                    const effect = Array.from(actor.effects.values())[index];
                    effect.delete();
                } else if (removeType == 'all') {
                    const effects = actor.effects;
                    for (const effect of effects) {
                        await effect.delete();
                    }
                }
            },
            [OnEventType.CHECK]: async (actor, event) => {
                const effects = actor.effects;
                for (const effect of effects) {
                    const effectDuration = effect.duration.type
                    if (effectDuration !== 'none') {
                        effect.delete();
                    }
                }
            },
            [OnEventType.VIEW]: async (actor, event, html) => {
                const minHeight = actor.sheet.defaultHeight;
                const effectsContainer = event.currentTarget.parentElement.parentElement.querySelector('#effects-container');
                const resultExpand = HtmlJsUtils.expandOrContractElement(effectsContainer, { minHeight: minHeight });
                HtmlJsUtils.flipClasses(event.currentTarget.children[0], 'fa-chevron-down', 'fa-chevron-up');

                actor.sheet.isExpandedEffects = resultExpand.isExpanded;
            }
        },
        temporary: handleStatusMethods,
        equipment: handlerEquipmentEvents
    }

    static _createDynamicSheet(html, isEditable) {
        SheetMethods.#createAttributes(html, isEditable);
        SheetMethods.#createRepertory(html, isEditable);
        SheetMethods.#createVirtues(html, isEditable);
        SheetMethods.#createAbilities(html, isEditable);
        SheetMethods.#createFame(html, isEditable);
        SheetMethods.#createLanguages(html, isEditable);
        SheetMethods.#createEnhancements(html, isEditable);
    }

    static #createAttributes(html, isEditable) {
        const characteristics = AttributeRepository._getItems();
        const container = html.find('#atributosContainer');
        this.#create(container, characteristics, CharacteristicType.ATTRIBUTE.id, 5, isEditable, true, true);
    }

    static #createRepertory(html, isEditable) {
        const characteristics = [
            { id: 'aliados', label: 'S0.Aliados' },
            { id: 'arsenal', label: 'S0.Arsenal' },
            { id: 'informantes', label: 'S0.Informantes' },
            { id: 'recursos', label: 'S0.Recursos' },
            { id: 'superequipamentos', label: 'S0.SuperEquipamentos' }
        ];

        const container = html.find('#repertorioContainer');
        this.#create(container, characteristics, CharacteristicType.REPERTORY.id, 5, isEditable, false, false);
    }

    static #createVirtues(html, isEditable) {
        const characteristics = [
            { id: 'consciencia', label: 'S0.Consciencia' },
            { id: 'perseveranca', label: 'S0.Perseveranca' },
            { id: 'quietude', label: 'S0.Quietude' }
        ];
        const container = html.find('#virtudesContainer');
        this.#create(container, characteristics, CharacteristicType.VIRTUES.id, 5, isEditable, false, true);
    }

    static #createAbilities(html, isEditable) {
        const characteristics = AbilityRepository._getItems();
        const container = html.find('#habilidadesContainer');
        this.#create(container, characteristics, CharacteristicType.ABILITY.id, 5, isEditable, true, false);
    }

    static #createFame(html, isEditable) {
        const container = html.find('#famaContainer');

        [
            { id: 'nucleo', label: 'S0.Nucleo', amount: 4, addLast: true, firstSelected: true },
            { id: 'influencia', label: 'S0.Influencia', amount: 5, addLast: false, firstSelected: false },
            { id: 'nivel_de_procurado', label: 'S0.Procurado', amount: 5, addLast: false, firstSelected: false },
        ].forEach(char => {
            const element = ElementCreatorJQuery._createCharacteristicContainer(
                char, CharacteristicType.SIMPLE.id, char.amount, isEditable, char.addLast, char.firstSelected
            );
            container.append(element);
        });
    }

    static #createLanguages(html, isEditable) {
        const container = html.find('#linguasContainer');
        const languages = LanguageRepository._getItems();

        languages.forEach(lang => {
            const element = ElementCreatorJQuery._createCharacteristicContainer(
                lang, CharacteristicType.LANGUAGE.id, 1, isEditable, false, lang.checked || false, OnEventType.ADD
            );
            container.append(element);
        });
    }

    static #createEnhancements(html, isEditable) {
        const container = html.find('.S0-enhancement select');
        const filteredElements = container.filter((index, element) => element.dataset.type === 'enhancement');
        const enhancements = EnhancementRepository._getItems();

        filteredElements.each((index, selectEnhancement) => {
            $(selectEnhancement).append(ElementCreatorJQuery._createOption(undefined, '', ''));

            const options = enhancements.map(enhance =>
                ElementCreatorJQuery._createOption(enhance.id, enhance.name, enhance.value)
            );
            $(selectEnhancement).append(options);
        });
    }

    static #create(container, characteristics, type, amount, isEditable, addLast, firstSelected) {
        characteristics.forEach(characteristic => {
            const element = ElementCreatorJQuery._createCharacteristicContainer(
                characteristic, type, amount, isEditable, addLast, firstSelected
            );
            container.append(element);
        });
    }

    static async _handleCharacteristicClickEvent(event, actor) {
        await characteristicOnClick(event, actor);
    }
}