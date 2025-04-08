import { ActorUtils } from "../../../../scripts/utils/actor.mjs";
import { selectCharacteristic } from "../../../../scripts/utils/utils.mjs";
import { CharacteristicType } from "../../../enums/characteristic-enums.mjs";
import { ActorUpdater } from "../../updater/actor-updater.mjs";
import { SheetMethods } from "../sheet-methods.mjs";

export async function characteristicOnClick(event, actor) {
    const element = event.target;

    selectCharacteristic(element);

    const characteristicType = event.currentTarget.dataset.characteristic;
    const systemCharacteristic = SheetMethods.characteristicTypeMap[characteristicType];

    if (systemCharacteristic) {
        const parentElement = element.parentElement;
        const level = Array.from(parentElement.children).filter(el => el.classList.contains('S0-selected')).length;
        handle(actor, systemCharacteristic, parentElement.id, level);
    }
}

async function handle(actor, systemCharacteristic, id, level) {
    if (systemCharacteristic.includes('virtudes')) {
        handleVirtue(actor, systemCharacteristic, id, level);
    } else {
        handleOtherwise(actor, systemCharacteristic, id, level);
    }
}

async function handleVirtue(actor, systemCharacteristic, virtueId, level) {
    const characteristic = `${systemCharacteristic}.${virtueId}.level`;
    ActorUpdater._verifyAndUpdateActor(actor, characteristic, level);
}

async function handleOtherwise(actor, systemCharacteristic, characteristicId, level) {
    const params = [];
    params.push(
        {
            systemCharacteristic: `${systemCharacteristic}.${characteristicId}`,
            value: level
        }
    );

    if (characteristicId == 'vigor') {
        params.push(
            {
                systemCharacteristic: CharacteristicType.VITALITY_TOTAL.system,
                value: ActorUtils.calculateVitalityByUpAttribute(actor, level)
            }
        );
    }

    ActorUpdater._verifyKeysAndUpdateActor(actor, params);
}
