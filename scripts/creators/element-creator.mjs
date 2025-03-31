import { OnEventType } from "../../module/enums/characteristic-enums.mjs";

export class ElementCreatorJQuery {
    static _createCharacteristicDiv(isEditable, safeEventType, characteristicType) {
        return $('<div>', {
            class: isEditable ? `S0-characteristic clickable` : `S0-characteristic`,
            'data-action': isEditable ? `${safeEventType.id}` : undefined,
            'data-characteristic': characteristicType
        });
    };

    static _createCharacteristicContainer(container, characteristic, characteristicType, amount, isEditable, addLast, firstSelected, eventType) {
        const safeEventType = eventType ? eventType : OnEventType.CHARACTERISTIC

        const divContainer = $('<div>', {
            class: 'characteristic-container',
            id: characteristic.id
        });

        const label = $('<label>', {
            text: game.i18n.localize(characteristic.label)
        });

        divContainer.append(label);

        for (let i = 0; i < amount; i++) {
            const divCaracteristica = this._createCharacteristicDiv(isEditable, safeEventType, characteristicType);
            if (firstSelected && i == 0) {
                divCaracteristica.addClass('selected');
            }
            divContainer.append(divCaracteristica);
        }

        if (addLast) {
            const divCaracteristica = this._createCharacteristicDiv(isEditable, safeEventType, characteristicType);
            divCaracteristica.addClass('S0-characteristic-6');
            divContainer.append(divCaracteristica);
        }

        container.append(divContainer);
        return divContainer[0];
    }

    static _createOption(itemId, name, value, selected) {
        return $('<option>', {
            value: value,
            text: name,
            'data-item-id': itemId,
            selected: selected || false
        });
    }
}