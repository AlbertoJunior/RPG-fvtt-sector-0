import { getObject, localize, TODO } from "../../../../../scripts/utils/utils.mjs";
import { ActorEquipmentUtils } from "../../../../core/actor/actor-equipment.mjs";
import { RollAttribute } from "../../../../core/rolls/attribute-roll.mjs";
import { AddEquipmentDialog } from "../../../../creators/dialog/add-equipment-dialog.mjs";
import { ConfirmationDialog } from "../../../../creators/dialog/confirmation-dialog.mjs";
import { UpdateEquipmentQuantityDialog } from "../../../../creators/dialog/update-equipment-quantity-dialog.mjs";
import { NotificationsUtils } from "../../../../creators/message/notifications.mjs";
import { EquipmentCharacteristicType, EquipmentType } from "../../../../enums/equipment-enums.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { EquipmentRepository } from "../../../../repository/equipment-repository.mjs";
import { DefaultActions } from "../../../../utils/default-actions.mjs";
import { ActorUpdater } from "../../../updater/actor-updater.mjs";
import { EquipmentUpdater } from "../../../updater/equipment-updater.mjs";

export const handlerEquipmentEvents = {
    [OnEventType.ADD]: async (actor, event) => EquipmentHandleEvents.handleAdd(actor, event),
    [OnEventType.REMOVE]: async (actor, event) => EquipmentHandleEvents.handleRemove(actor, event),
    [OnEventType.EDIT]: async (actor, event) => EquipmentHandleEvents.handleEdit(actor, event),
    [OnEventType.CHECK]: async (actor, event) => EquipmentHandleEvents.handleCheck(actor, event),
    [OnEventType.VIEW]: async (actor, event) => EquipmentHandleEvents.handleView(actor, event),
    [OnEventType.CHAT]: async (actor, event) => EquipmentHandleEvents.handleChat(actor, event),
    [OnEventType.ROLL]: async (actor, event) => EquipmentHandleEvents.handleRoll(actor, event),
}

class EquipmentHandleEvents {
    static async handleCheck(actor, event) {
        const target = event.currentTarget;
        const dataset = target.dataset;
        const subCharacteristic = dataset.subCharacteristic;
        const type = dataset.type;
        const sheet = actor.sheet;

        switch (subCharacteristic) {
            case 'filter':
                this.#handleCheckFilter(sheet, type, target);
                return;
            case 'bag':
                this.#handleCheckBag(actor, target);
                return;
            case 'menu':
                this.#handleCheckMenu(actor, target);
                return;
        }
    }

    static #handleCheckFilter(sheet, type, target) {
        const typeId = EquipmentType[type.toUpperCase()];
        if (sheet.filterBag == typeId) {
            sheet.filterBag = EquipmentType.UNKNOWM;
            sheet.render();
            return;
        }

        target.classList.add('S0-selected');

        sheet.filterBag = typeId;
        sheet.render();
    }

    static #handleCheckBag(actor, target) {
        const equipmentId = target.dataset.itemId;
        const equipment = ActorEquipmentUtils.getActorEquipmentById(actor, equipmentId);
        if (!equipment) {
            return;
        }

        ConfirmationDialog.open({
            message: localize('Pergunta.Usar_Item'),
            onConfirm: () => {
                const actualValue = getObject(equipment, EquipmentCharacteristicType.QUANTITY);
                const newValue = Math.max(0, actualValue - 1);
                EquipmentUpdater.updateEquipment(equipment, EquipmentCharacteristicType.QUANTITY, newValue);
            }
        });
    }

    static async #handleCheckMenu(actor, target) {
        const type = target.dataset.type;
        const isUnlock = target.dataset.itemType == 'unlock';
        switch (type) {
            case 'equipped': {
                this.#lockUnlockEquippedItems(actor, isUnlock);
                return;
            }
            case 'bag': {
                this.#lockUnlockBagItems(actor, isUnlock);
                return;
            }
        }
    }

    static async #lockUnlockBagItems(actor, isUnlock) {
        const equipments = ActorEquipmentUtils.getActorEquipments(actor);
        equipments.forEach(async (equipment) => {
            EquipmentUpdater.updateEquipmentFlags(equipment, 'editable', isUnlock);
        });
    }

    static async #lockUnlockEquippedItems(actor, isUnlock) {
        const equipments = ActorEquipmentUtils.getActorEquippedItems(actor);
        equipments.forEach(async (equipment) => {
            EquipmentUpdater.updateEquipmentFlags(equipment, 'editable', isUnlock);
        });
    }

    static async handleEdit(actor, event) {
        const target = event.currentTarget;
        const dataset = target.dataset;
        const subCharacteristic = dataset.subCharacteristic;

        switch (subCharacteristic) {
            case 'bag': {
                this.#handleEditBag(actor, target);
                return;
            }
        }
    }

    static #handleEditBag(actor, target) {
        const equipmentId = target.dataset.itemId;
        const equipment = ActorEquipmentUtils.getActorEquipmentById(actor, equipmentId);
        if (!equipment) {
            return;
        }

        const actualValue = getObject(equipment, EquipmentCharacteristicType.QUANTITY);

        UpdateEquipmentQuantityDialog.updateQuantityDialog(actualValue, (value) => {
            const newValue = Math.max(0, actualValue + value);
            EquipmentUpdater.updateEquipment(equipment, EquipmentCharacteristicType.QUANTITY, newValue);
        });
    }

    static async handleAdd(actor, event) {
        const target = event.currentTarget;
        const dataset = target.dataset;
        const subCharacteristic = dataset.subCharacteristic;
        const type = dataset.type;

        switch (subCharacteristic) {
            case 'menu': {
                if (type == 'bag') {
                    const allItems = EquipmentRepository.getItems();
                    AddEquipmentDialog.showItemSelectorDialog(allItems, (selectedItems) => {
                        const allItemsData = [];
                        for (const equipament of selectedItems) {
                            const itemData = ActorEquipmentUtils.createDataItem(equipament);
                            if (itemData) {
                                allItemsData.push(itemData);
                            }
                        }

                        ActorUpdater.addDocuments(actor, allItemsData);
                    });
                }
            }
            case 'bag': {
                const equipmentId = dataset.itemId;
                const equipment = ActorEquipmentUtils.getActorEquipmentById(actor, equipmentId);
                if (equipment) {
                    await ActorEquipmentUtils.equip(actor, equipment);
                }
                return;
            }
        }
    }

    static async handleRemove(actor, event) {
        const target = event.currentTarget;
        const dataset = target.dataset;
        const equipmentId = dataset.itemId;
        const subCharacteristic = dataset.subCharacteristic;

        switch (subCharacteristic) {
            case 'menu': {
                this.#handleRemoveMenu(actor, dataset.type);
                return;
            }
            case 'bag': {
                ActorUpdater.removeDocuments(actor, [equipmentId]);
                return;
            }
            case 'equipped': {
                const equipment = ActorEquipmentUtils.getActorEquipmentById(actor, equipmentId);
                if (equipment) {
                    await ActorEquipmentUtils.unequip(actor, equipment);
                }
                return;
            }
        }
    }

    static async #handleRemoveMenu(actor, type) {
        switch (type) {
            case 'bag': {
                const params = {
                    message: "Essa ação irá remover todos os itens da mochila",
                    onConfirm: () => ActorUpdater.removeDocuments(actor, ActorEquipmentUtils.getActorEquipments(actor).map(item => item.id))
                }
                ConfirmationDialog.open(params);
                return;
            }
            case 'equipped': {
                const params = {
                    message: "Essa ação irá desequipar todos os itens equipados",
                    onConfirm: () => this.#unequipAllItems(actor)
                }
                ConfirmationDialog.open(params);
                return;
            }
        }
    }

    static async #unequipAllItems(actor) {
        const equipmentsUnequipPromises = ActorEquipmentUtils.getActorEquippedItems(actor).map(equipment => ActorEquipmentUtils.unequip(actor, equipment));
        await Promise.all(equipmentsUnequipPromises);
    }

    static async handleView(actor, event) {
        const equipmentId = event.currentTarget.dataset.itemId;
        const item = ActorEquipmentUtils.getActorEquipmentById(actor, equipmentId);
        if (item) {
            item.sheet.render(true, { editable: false });
        }
    }

    static async handleChat(actor, event) {
        TODO('implementar o chat');
    }

    static async handleRoll(actor, event) {
        const equipmentId = event.currentTarget.dataset.itemId;
        const item = ActorEquipmentUtils.getActorEquipmentById(actor, equipmentId);
        if (!item) {
            return;
        }

        const defaultTestId = getObject(item, EquipmentCharacteristicType.DEFAULT_TEST);
        if (!defaultTestId) {
            NotificationsUtils._warning("É preciso definir um teste padrão para o item");
            return;
        }

        const rollTest = getObject(item, EquipmentCharacteristicType.POSSIBLE_TESTS).find(test => test.id == defaultTestId);
        if (!rollTest) {
            return;
        }

        let resultRoll;
        if (item.system.isWeapon) {
            resultRoll = await RollAttribute.rollByRollableTestsWithWeapon(actor, rollTest, item);
        } else {
            resultRoll = await RollAttribute.rollByRollableTests(actor, rollTest);
        }

        await DefaultActions.sendRollOnChat(item.actor, resultRoll, rollTest.difficulty, rollTest.critic, rollTest.name);
    }
}