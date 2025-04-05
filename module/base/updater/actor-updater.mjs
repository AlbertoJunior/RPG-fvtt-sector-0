import { NotificationsUtils } from "../../../scripts/utils/notifications.mjs";
import { getObject } from "../../../scripts/utils/utils.mjs";

export class ActorUpdater {
    static async _verifyAndUpdateActor(actor, systemCharacteristic, value) {
        if (getObject(actor, systemCharacteristic) == undefined) {
            NotificationsUtils._warning('Não foi possível editar o personagem')
            console.warn(`-> [${systemCharacteristic}] não existe, impossível atualizar o Actor`)
            return;
        }

        const characteristic = {
            [`${systemCharacteristic}`]: value
        };

        await actor.update(characteristic);
    }
}