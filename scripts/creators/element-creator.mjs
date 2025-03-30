import { OnClickEventType } from "../../module/enums/characteristic-enums.mjs";

export class ElementCreator {
    static _createCharacteristicDiv(isEditable, safeEventType, characteristicType) {
        return $('<div>', {
            class: isEditable ? `caracteristica clickable` : `caracteristica`,
            'data-action': isEditable ? `${safeEventType.id}` : undefined,
            'data-characteristic': characteristicType
        });
    };

    static _createCharacteristicContainer(container, characteristic, characteristicType, amount, isEditable, addLast, firstSelected, eventType) {
        const safeEventType = eventType ? eventType : OnClickEventType.CHARACTERISTIC

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
            divCaracteristica.addClass('caracteristica-6');
            divContainer.append(divCaracteristica);
        }

        container.append(divContainer);
        return divContainer[0];
    }
}