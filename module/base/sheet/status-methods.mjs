import { selectCharacteristic } from "../../../scripts/utils/utils.mjs";
import { CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { DefaultActions } from "../../utils/default-actions.mjs";
import { ActorUpdater } from "../updater/actor-updater.mjs";

function selectLifeCharacteristic(event, addClassIfBlank) {
    let toUpdate = event.currentTarget;
    let addedBlank = false;
    while (toUpdate) {
        const haveSuperficial = toUpdate.classList.contains('S0-superficial');
        const haveLetal = toUpdate.classList.contains('S0-letal');
        if (haveSuperficial && !addedBlank) {
            toUpdate.classList.replace('S0-superficial', 'S0-letal');
            return;
        } else if (haveLetal && !addedBlank) {
            toUpdate.classList.remove('S0-letal');
            return;
        } else if (!haveSuperficial && !haveLetal) {
            addedBlank = true;
            toUpdate.classList.add(addClassIfBlank);
            toUpdate = toUpdate.previousElementSibling;
        } else {
            return;
        }
    }
}

function mountLifeCharacteristicToUpdate(event) {
    const parentElement = event.currentTarget.parentElement;
    return [
        {
            systemCharacteristic: CharacteristicType.SUPERFICIAL_DAMAGE.system,
            value: parentElement.querySelectorAll('.S0-superficial').length
        },
        {
            systemCharacteristic: CharacteristicType.LETAL_DAMAGE.system,
            value: parentElement.querySelectorAll('.S0-letal').length
        },
    ];
}

const mapContextual = {
    health: async (actor, event) => {
        selectLifeCharacteristic(event, 'S0-superficial');
        const keysToUpdate = mountLifeCharacteristicToUpdate(event);
        ActorUpdater._verifyKeysAndUpdateActor(actor, keysToUpdate);
    }
}

const mapCheck = {
    virtue: async (actor, event) => {
        const itemType = event.currentTarget.dataset.itemType;
        const characteristicKey = `system.virtudes.${itemType}.used`;
        selectCharacteristic(event.currentTarget);
        const value = event.currentTarget.parentElement.querySelectorAll('.S0-selected').length;
        ActorUpdater._verifyAndUpdateActor(actor, characteristicKey, value);
    },
    overload: async (actor, event) => {
        const characteristicKey = CharacteristicType.OVERLOAD.system;
        selectCharacteristic(event.currentTarget);
        const value = event.currentTarget.parentElement.querySelectorAll('.S0-selected').length;
        ActorUpdater._verifyAndUpdateActor(actor, characteristicKey, value);
    },
    life: async (actor, event) => {
        const characteristicKey = CharacteristicType.LIFE.system;
        selectCharacteristic(event.currentTarget);
        const value = event.currentTarget.parentElement.querySelectorAll('.S0-selected').length;
        ActorUpdater._verifyAndUpdateActor(actor, characteristicKey, value);
    },
    health: async (actor, event) => {
        selectLifeCharacteristic(event, 'S0-letal')
        const keysToUpdate = mountLifeCharacteristicToUpdate(event);
        ActorUpdater._verifyKeysAndUpdateActor(actor, keysToUpdate);
    }
}

const mapRoll = {
    overload: async (actor, event) => {
        DefaultActions.processOverloadRoll(actor);
    },
    initiative: async (actor, event) => {
        DefaultActions.processInitiativeRoll(actor);
    }
}

const mapRemove = {
    all: async (actor, event) => {
        const keysToUpdate = [
            {
                systemCharacteristic: CharacteristicType.CONSCIOUSNESS_USED.system,
                value: 0
            },
            {
                systemCharacteristic: CharacteristicType.PERSEVERANCE_USED.system,
                value: 0
            },
            {
                systemCharacteristic: CharacteristicType.QUIETNESS_USED.system,
                value: 0
            },
            {
                systemCharacteristic: CharacteristicType.OVERLOAD.system,
                value: 0
            },
            {
                systemCharacteristic: CharacteristicType.SUPERFICIAL_DAMAGE.system,
                value: 0
            },
            {
                systemCharacteristic: CharacteristicType.LETAL_DAMAGE.system,
                value: 0
            },
        ];

        ActorUpdater._verifyKeysAndUpdateActor(actor, keysToUpdate);
    },
    virtue: async (actor, event) => {
        const itemType = event.currentTarget.dataset.itemType;
        const characteristicKey = `system.virtudes.${itemType}.used`;
        ActorUpdater._verifyAndUpdateActor(actor, characteristicKey, 0);
    },
    overload: async (actor, event) => {
        ActorUpdater._verifyAndUpdateActor(actor, CharacteristicType.OVERLOAD.system, 0);
    },
    health: async (actor, event) => {
        const keysToUpdate = [
            {
                systemCharacteristic: CharacteristicType.SUPERFICIAL_DAMAGE.system,
                value: 0
            },
            {
                systemCharacteristic: CharacteristicType.LETAL_DAMAGE.system,
                value: 0
            },
        ];
        ActorUpdater._verifyKeysAndUpdateActor(actor, keysToUpdate);
    }
}

function handleMethodOnMap(map, actor, event) {
    const type = event.currentTarget.dataset.type;
    const method = map[type];
    if (method) {
        method(actor, event);
    } else {
        console.log(event);
    }
}

export const handleStatusMethods = {
    contextual: async (actor, event) => {
        handleMethodOnMap(mapContextual, actor, event);
    },
    check: async (actor, event) => {
        handleMethodOnMap(mapCheck, actor, event);
    },
    remove: async (actor, event) => {
        handleMethodOnMap(mapRemove, actor, event);
    },
    roll: async (actor, event) => {
        handleMethodOnMap(mapRoll, actor, event);
    }
}