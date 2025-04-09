import { CoreRollMethods } from "../../module/core/rolls/core-roll-methods.mjs";
import { RollPerseverance } from "../../module/core/rolls/perseverance-roll.mjs";
import { RollPerseveranceMessageCreator } from "../../module/creators/message/perseverance-roll.mjs";
import { ChatCreator } from "../creators/chat-creator.mjs";
import { MessageRepository } from "../repository/message-repository.mjs";

const mapEventsHandle = {
    'toggle-tooltip': (target) => toggleTooltip(target),
    'roll': {
        'perseverance': (target) => perseverance(target),
    },
}

export function addListenersOnDOM() {
    document.body.addEventListener('click', (event) => {
        const target = event.target;
        const eventData = target.dataset;

        if (!eventData)
            return;

        const action = eventData.action;
        if (!action || action == '')
            return;

        const method = mapEventsHandle[action];
        if (typeof method === 'function') {
            return method(target);
        }

        const type = eventData.type;
        const methodOfType = method?.[type];
        if (typeof methodOfType === 'function') {
            return methodOfType(target);
        }

        console.log(`Não existe evento configurado para [${action}]`);
    });
}

function toggleTooltip(target) {
    let tooltip = target.previousElementSibling;
    let hooks = 0;
    while (hooks < 5 && tooltip) {
        if (tooltip.classList.contains('tooltip-part')) {
            tooltip.classList.toggle('hidden');
            return;
        } else {
            tooltip = tooltip.previousElementSibling;
            hooks++;
        }
    }
}

async function perseverance(target) {
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

    const messageContent = await RollPerseveranceMessageCreator.mountContent(newValues);
    const actorOnMessage = game.actors.get(message.speaker.actor);

    removePerseveranceButton(message, target);
    ChatCreator._sendToChatTypeRoll(actorOnMessage, messageContent, [newValues.roll]);
}

function removePerseveranceButton(message, button) {
    let $content = $(message.content);
    let $button = $content.find(`button[data-action="${button.dataset.action}"][data-type="${button.dataset.type}"]`);
    if ($button) {
        $button.text("Perseverança utilizada");
        $button.removeAttr('data-action').removeAttr('data-type');
        $button.attr('disabled', true);
        MessageRepository.updateMessage(message, { content: $content.prop('outerHTML') });
    }
}