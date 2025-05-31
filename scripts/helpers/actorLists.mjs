import { ActorEquipmentUtils } from "../../module/core/actor/actor-equipment.mjs";
import { ActorUtils } from "../../module/core/actor/actor-utils.mjs";

const map = {
    'equipment-filtered': (actor) => {
        const type = actor.sheet.filterBag || 0;
        return ActorEquipmentUtils.getFilteredUnequippedEquipment(actor, type);
    },
    'equipment-equipped': (actor) => {
        return ActorEquipmentUtils.getEquippedItems(actor);
    },
    'allies': (actor) => {
        return ActorUtils.getAllies(actor);
    },
    'informants': (actor) => {
        return ActorUtils.getInformants(actor);
    },
}

export default function actorLists(actor, value) {
    const mappedItem = map[value]
    if (typeof mappedItem == 'function') {
        return mappedItem(actor);
    }

    return [];
}