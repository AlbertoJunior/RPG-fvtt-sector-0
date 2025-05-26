import { getObject, selectCharacteristicAndReturnLength } from "../../../../../scripts/utils/utils.mjs";
import { EquipmentUtils } from "../../../../core/equipment/equipment-utils.mjs";
import { ConfirmationDialog } from "../../../../creators/dialog/confirmation-dialog.mjs";
import { EquipmentCharacteristicType } from "../../../../enums/equipment-enums.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { SuperEquipmentField } from "../../../../field/equipment-field.mjs";
import { EquipmentUpdater } from "../../../updater/equipment-updater.mjs";

export const handlerEquipmentCharacteristicsEvents = {
    [OnEventType.CHECK]: async (item, event) => EquipmentSheetCharacteristicsHandle.check(item, event),
}

class EquipmentSheetCharacteristicsHandle {
    static async check(item, event) {
        const target = event.currentTarget;
        const type = target.dataset.type;

        const mapCheck = {
            'superequipment': (item, target) => this.#checkSuperEquipment(item, target),
            'level': (item, target) => this.#checkLevel(item, target),
        }

        mapCheck[type]?.(item, target);
    }

    static async #checkSuperEquipment(item, target) {
        const checked = target.checked;
        const superEquipment = getObject(item, EquipmentCharacteristicType.SUPER_EQUIPMENT);
        if (superEquipment && EquipmentUtils.getSuperEquipmentHaveEffects(superEquipment)) {
            ConfirmationDialog.open({
                titleDialog: "Excluir SuperEquipamento?",
                message: "Essa ação irá excluir todas as informações do SuperEquipamento, tem certeza que deseja continuar?",
                onConfirm: () => {
                    this.operateSuperEquipmentCheck(item, target, checked);
                }
            });
        } else {
            this.operateSuperEquipmentCheck(item, target, checked);
        }
    }

    static operateSuperEquipmentCheck(item, target, checked) {
        const parentClassList = target.parentElement.parentElement.classList;
        let objectToSet;
        if (checked) {
            parentClassList.remove('S0-superequipment-contracted');
            objectToSet = SuperEquipmentField.toJson();
        } else {
            parentClassList.add('S0-superequipment-contracted');
            objectToSet = null;
        }

        setTimeout(async () => {
            await EquipmentUpdater.updateEquipment(item, EquipmentCharacteristicType.SUPER_EQUIPMENT, objectToSet);
        }, 150);
    }

    static async #checkLevel(item, target) {
        const level = selectCharacteristicAndReturnLength(target);
        await EquipmentUpdater.updateEquipment(item, EquipmentCharacteristicType.SUPER_EQUIPMENT.LEVEL, level);
    }
}