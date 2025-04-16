import { SYSTEM_ID } from "../../constants.mjs";
import { ActorEquipmentUtils } from "../../core/equipment/actor-equipment.mjs";
import { ActorUpdater } from "./actor-updater.mjs";

export class EquipmentUpdater {
    static async updateEquipment(equipment, characteristic, value) {
        return await this.updateEquipmentData(equipment, [{ characteristic, value }]);
    }

    static async updateEquipmentData(equipment, changes = []) {
        const dataToUpdate = {};
        for (const { characteristic, value } of changes) {
            if (getObject(equipment, characteristic) === undefined) {
                console.warn(`-> [${characteristic}] não existe, impossível atualizar o Equipamento`);
            } else {
                dataToUpdate[characteristic] = value;
            }
        }

        if (Object.keys(dataToUpdate).length > 0) {
            return await equipment.update(dataToUpdate);
        }
    }

    static async updateEquipmentFlags(equipment, flagKey, value) {
        return await this.updateOnActorEquipmentFlags(equipment, [{ flagKey, value }]);
    }

    static async updateOnActorEquipmentFlags(equipment, updates = []) {
        if (!equipment) {
            console.warn(`[EquipmentUpdater] Equipamento não encontrado: ${equipment}`);
            return;
        }

        const flags = foundry.utils.deepClone(equipment.flags?.[SYSTEM_ID] || {});

        for (const { flagKey, value } of updates) {
            flags[flagKey] = value;
        }

        return await equipment.update(
            {
                [`flags.${SYSTEM_ID}`]: flags
            }
        );
    }

    static async updateOnActorMultipleEquipments(actor, equipmentsData = []) {
        const updatedItems = [];

        for (const { equipmentId, flagsToUpdate } of equipmentsData) {
            const equipment = ActorEquipmentUtils.getActorEquipmentById(actor, equipmentId);
            if (!equipment) {
                console.warn(`[EquipmentUpdater] Equipamento não encontrado: ${equipmentId}`);
                continue;
            }

            const existingFlags = foundry.utils.deepClone(equipment.flags?.[SYSTEM_ID] || {});
            for (const { flagKey, value } of flagsToUpdate) {
                existingFlags[flagKey] = value;
            }

            updatedItems.push({
                _id: equipmentId,
                [`flags.${SYSTEM_ID}`]: existingFlags
            });
        }

        if (updatedItems.length) {
            await ActorUpdater.updateDocuments(actor, updatedItems);
        }
    }
}