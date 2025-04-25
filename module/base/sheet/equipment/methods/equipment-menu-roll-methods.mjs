import { getObject, TODO } from "../../../../../scripts/utils/utils.mjs";
import { CreateRollableTestDialog } from "../../../../creators/dialog/create-roll-test-dialog.mjs";
import { NotificationsUtils } from "../../../../creators/message/notifications.mjs";
import { EquipmentCharacteristicType } from "../../../../enums/equipment-enums.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { HtmlJsUtils } from "../../../../utils/html-js-utils.mjs";

export const handlerEquipmentMenuRollEvents = {
    [OnEventType.ADD]: async (item, event) => EquipmentSheetMenuRollHandle.add(item, event),
    [OnEventType.VIEW]: async (item, event) => EquipmentSheetMenuRollHandle.view(item, event),
}

class EquipmentSheetMenuRollHandle {
    static add(item, event) {        
        const onConfirm = async (rollable) => {
            if (!rollable.name) {
                NotificationsUtils._error("O Teste precisa de um nome");
                return;
            }
            
            const current = getObject(item, EquipmentCharacteristicType.POSSIBLE_TESTS) || [];
            current.push(rollable);

            const characteristicToUpdate = {
                [EquipmentCharacteristicType.POSSIBLE_TESTS.system]: current
            }

            if (current.length == 1) {
                characteristicToUpdate[EquipmentCharacteristicType.DEFAULT_TEST.system] = rollable.id;
            }
            TODO('colocar com ItemUpdater')
            await item.update(characteristicToUpdate);
        };

        CreateRollableTestDialog._open(null, onConfirm);
    }

    static view(item, event) {
        const target = event.currentTarget;

        HtmlJsUtils.flipClasses(target.children[0], 'fa-chevron-up', 'fa-chevron-down');
        
        const containerList = target.parentElement.parentElement.parentElement.querySelector('#rollable-tests-list');
        const expandResult = HtmlJsUtils.expandOrContractElement(containerList, { minHeight: item.sheet.defaultHeight, maxHeight: 640 });
        item.sheet.isExpandedTests = expandResult.isExpanded;
        item.sheet.newHeight = expandResult.newHeight;
    }
}