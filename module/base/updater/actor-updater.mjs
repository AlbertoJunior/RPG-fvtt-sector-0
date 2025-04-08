import { getObject } from "../../../scripts/utils/utils.mjs";

export class ActorUpdater {
    static async _verifyAndUpdateActor(actor, systemCharacteristic, value) {
        await this._verifyKeysAndUpdateActor(actor, [{ systemCharacteristic: systemCharacteristic, value: value }]);
    }

    static async _verifyKeysAndUpdateActor(actor, params = []) {
        const keysToUpdate = {};
        params.forEach(item => {
            if (getObject(actor, item.systemCharacteristic) == undefined) {
                console.warn(`-> [${item.systemCharacteristic}] não existe, impossível atualizar o Actor`);
            } else {
                keysToUpdate[item.systemCharacteristic] = item.value;
            }
        });

        await actor.update(keysToUpdate);
    }
}