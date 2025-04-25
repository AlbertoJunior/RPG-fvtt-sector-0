import { ActorRollDialog } from "../../../../creators/dialog/actor-roll-dialog.mjs";
import { ElementCreatorJQuery } from "../../../../../scripts/creators/jquery/element-creator.mjs";
import { getActorFlag, getObject, selectCharacteristic, setActorFlag } from "../../../../../scripts/utils/utils.mjs";
import { CharacteristicType, CharacteristicTypeMap } from "../../../../enums/characteristic-enums.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { handleStatusMethods } from "./status-methods.mjs";
import { handlerEquipmentEvents } from "./equipment-methods.mjs";
import { traitMethods } from "./trait-methods.mjs";
import { characteristicOnClick } from "./characteristics-methods.mjs";
import { FlagsUtils } from "../../../../utils/flags-utils.mjs";
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
        this.#createFame(html, isEditable);
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

    static async _handleCharacteristicClickEvent(event, actor) {
        await characteristicOnClick(event, actor);
    }
}