import { ActorEquipmentUtils } from "../../module/core/equipment/actor-equipment.mjs";

const map = {
    'equipment-filtered': (actor) => {
        const type = actor.sheet.filterBag || 0;
        return ActorEquipmentUtils.getActorFilteredEquipment(actor, type);
    },
    'equipment-equipped': (actor) => {
        return ActorEquipmentUtils.getActorEquippedItems(actor);
    }
}

export default function actorLists(actor, value) {
    const mappedItem = map[value]
    if (typeof mappedItem == 'function') {
        return mappedItem(actor);
    }

    return [];
}