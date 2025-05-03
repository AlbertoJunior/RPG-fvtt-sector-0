import { ActorRollDialog } from "../../../../creators/dialog/actor-roll-dialog.mjs";
import { ElementCreatorJQuery } from "../../../../creators/element/element-creator-jquery.mjs";
import { getObject, selectCharacteristic, } from "../../../../../scripts/utils/utils.mjs";
import { CharacteristicType, CharacteristicTypeMap } from "../../../../enums/characteristic-enums.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { handleStatusMethods } from "./status-methods.mjs";
import { handlerEquipmentEvents } from "./equipment-methods.mjs";
import { traitMethods } from "./trait-methods.mjs";
import { characteristicOnClick } from "./characteristics-methods.mjs";
import { enhancementHandleMethods } from "../methods/enhancement-methods.mjs";
import { ActorUpdater } from "../../../updater/actor-updater.mjs";
import { handlerShortcutEvents } from "./shortcut-methods.mjs";
import { menuHandleMethods } from "../../../menu-default-methods.mjs";
import { alliesHandleEvents, informantsHandleEvents } from "./network-methods.mjs"
import { effectsHandleEvents } from "./effects-methods.mjs";

export class SheetMethods {
    static characteristicTypeMap = CharacteristicTypeMap;

    static handleMethods = {
        menu: {
            [OnEventType.ROLL]: async (actor, event) => { ActorRollDialog._open(actor); },
            [OnEventType.CHECK]: async (actor, event) => { menuHandleMethods.check(actor, event); },
            [OnEventType.VIEW]: async (actor, event) => { menuHandleMethods.view(actor, event); },
        },
        language: {
            [OnEventType.ADD]: async (actor, event) => {
                if (!actor.sheet.isEditable) {
                    return;
                }

                const element = event.target;
                selectCharacteristic(element);

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

                await ActorUpdater._verifyAndUpdateActor(actor, CharacteristicType.LANGUAGE, new Set(updatedLanguages))
            }
        },
        trait: traitMethods,
        enhancement: enhancementHandleMethods,
        effects: effectsHandleEvents,
        temporary: handleStatusMethods,
        equipment: handlerEquipmentEvents,
        allies: alliesHandleEvents,
        informants: informantsHandleEvents,
        shortcuts: handlerShortcutEvents
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