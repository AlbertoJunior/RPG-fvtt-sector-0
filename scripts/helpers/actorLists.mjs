import { EquipmentRepository } from "../../module/repository/equipment-repository.mjs";

const map = {
    'equipment-filtered': (actor) => {
        const type = actor.sheet.filterBag || 0;
        return EquipmentRepository.getFilteredEquipment(actor, type);
    },
    'equipment-equipped': (actor) => {
        return EquipmentRepository.getEquippedItems(actor);
    }
}

export default function actorLists(actor, value) {
    const mappedItem = map[value]
    if (typeof mappedItem == 'function') {
        return mappedItem(actor);
    }

    return [];
}