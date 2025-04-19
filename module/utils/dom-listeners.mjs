import { CoreRollMethods } from "../core/rolls/core-roll-methods.mjs";
import { RollPerseverance } from "../core/rolls/perseverance-roll.mjs";
import { RollPerseveranceMessageCreator } from "../creators/message/perseverance-roll.mjs";
import { ChatCreator } from "./chat-creator.mjs";
import { MessageRepository } from "../repository/message-repository.mjs";
import { HtmlJsUtils } from "./html-js-utils.mjs";

export class DOMUtils {
    static #mapEventsHandle = {
        'toggle-tooltip': (target) => this.#toggleTooltip(target),
        'roll': {
            'perseverance': (target) => this.#perseverance(target),
        },
    }

    static addListenersOnDOM() {
        document.body.addEventListener('click', (event) => {
            const target = event.target;
            const eventData = target.dataset;

            if (!eventData || !eventData.handleOnDom) {
                return;
            }

            const action = eventData.action;
            if (!action) {
                return;
            }

            const method = this.#mapEventsHandle[action];
            if (typeof method === 'function') {
                return method(target);
            }

            const type = eventData.type;
            const methodOfType = method?.[type];
            if (typeof methodOfType === 'function') {
                return methodOfType(target);
            }

            console.log(`Não existe evento configurado no DOM para [${action}]`);
        });
    }

    static #toggleTooltip(target) {
        let tooltip = target.previousElementSibling;
        let hooks = 0;
        while (hooks < 5 && tooltip) {
            if (tooltip.classList.contains('S0-container-contract')) {
                HtmlJsUtils.expandOrContractMessageElement(tooltip, { minHeight: 300, maxHeight: 600, marginBottom: 0 })
                return;
            } else {
                tooltip = tooltip.previousElementSibling;
                hooks++;
            }
        }
    }

    static async #perseverance(target) {
        const messageId = target.parentElement.parentElement.parentElement.parentElement.dataset.messageId;
        const message = MessageRepository.findMessage(messageId);
        const rollsOnMessage = message.rolls.filter(roll => roll.options.isOverload == false);

        if (!rollsOnMessage || rollsOnMessage.length < 1) {
            console.log(`Nenhuma rolagem encontrada`);
            return;
        }

        const roll = rollsOnMessage[0];
        const values = CoreRollMethods.getValuesOnRoll(roll);
        const newValues = await RollPerseverance.rerrollValues(values);

        newValues.difficulty = roll.options.difficulty || 6;
        newValues.specialist = roll.options.specialist || false;
        newValues.automatic = (roll.options.automatic || 0) + (roll.options?.weapon?.true_damage || 0);

        const messageContent = await RollPerseveranceMessageCreator.mountContent(newValues);
        const actorOnMessage = game.actors.get(message.speaker.actor);

        this.#removePerseveranceButton(message, target);
        ChatCreator._sendToChatTypeRoll(actorOnMessage, messageContent, [newValues.roll]);
    }

    static #removePerseveranceButton(message, button) {
        let $content = $(message.content);
        let $button = $content.find(`button[data-action="${button.dataset.action}"][data-type="${button.dataset.type}"]`);
        if ($button) {
            $button.text("Perseverança utilizada");
            $button.removeAttr('data-action').removeAttr('data-type');
            $button.attr('disabled', true);
            MessageRepository.updateMessage(message, { content: $content.prop('outerHTML') });
        }
    }
}