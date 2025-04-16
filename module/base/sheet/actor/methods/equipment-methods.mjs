import { TODO } from "../../../../../scripts/utils/utils.mjs";
import { ActorEquipmentUtils } from "../../../../core/equipment/actor-equipment.mjs";
import { AddEquipmentDialog } from "../../../../creators/dialog/add-equipment-dialog.mjs";
import { ConfirmationDialog } from "../../../../creators/dialog/confirmation-dialog.mjs";
import { UpdateEquipmentQuantityDialog } from "../../../../creators/dialog/update-equipment-quantity-dialog copy.mjs";
import { EquipmentType } from "../../../../enums/equipment-enums.mjs";
import { EquipmentRepository } from "../../../../repository/equipment-repository.mjs";
import { ActorUpdater } from "../../../updater/actor-updater.mjs";
import { EquipmentUpdater } from "../../../updater/equipment-updater.mjs";

export const handlerEquipmentEvents = {
    add: async (actor, event) => EquipmentHandleEvents.handleAdd(actor, event),
    remove: async (actor, event) => EquipmentHandleEvents.handleRemove(actor, event),
    edit: async (actor, event) => EquipmentHandleEvents.handleEdit(actor, event),
    check: async (actor, event) => EquipmentHandleEvents.handleCheck(actor, event),
    view: async (actor, event) => EquipmentHandleEvents.handleView(actor, event),
    chat: async (actor, event) => EquipmentHandleEvents.handleChat(actor, event),
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
            message: "Usar o Item?",
            onConfirm: () => {
                const actualValue = equipment.system.actualQuantity;
                const newValue = Math.max(0, actualValue - 1);
                EquipmentUpdater.updateEquipmentFlags(equipment, "quantity", newValue);
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
        equipments.forEach(async (equip) => {
            EquipmentUpdater.updateEquipmentFlags(equip, 'editable', isUnlock);
        });
    }

    static async #lockUnlockEquippedItems(actor, isUnlock) {
        const equipments = ActorEquipmentUtils.getActorEquippedItems(actor);
        equipments.forEach(async (equip) => {
            EquipmentUpdater.updateEquipmentFlags(equip, 'editable', isUnlock);
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

        const actualValue = equipment.system.actualQuantity;

        UpdateEquipmentQuantityDialog.updateQuantityDialog(actualValue, (value) => {
            const newValue = Math.max(0, actualValue + value);
            EquipmentUpdater.updateEquipmentFlags(equipment, "quantity", newValue);
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
        const equipmentsData = ActorEquipmentUtils.getActorEquippedItems(actor).map(equipment => {
            return {
                equipmentId: equipment.id,
                flagsToUpdate: [
                    {
                        flagKey: "equipped",
                        value: false
                    }
                ]
            }
        });
        await EquipmentUpdater.updateOnActorMultipleEquipments(actor, equipmentsData);
    }

    static async handleView(actor, event) {
        const target = event.currentTarget;
        const dataset = target.dataset;
        const equipmentId = dataset.itemId;
        const item = ActorEquipmentUtils.getActorEquipmentById(actor, equipmentId);
        if (item) {
            item.sheet.render(true, { editable: false });
        }
    }

    static async handleChat(actor, event) {
        TODO('implementar o chat');
    }
}