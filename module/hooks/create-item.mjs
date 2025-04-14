import { EquipmentRepository } from "../repository/equipment-repository.mjs";

export class CreateItemHookHandle {
    static async handle(item) {
        const canContinue = this.#validateItemAgainstPackFilter(item);

        if (!canContinue) {
            return;
        }
        
        this.#operateItemCreated(item);
    }

    static async #validateItemAgainstPackFilter(item) {
        const { pack: packId, type: itemType } = item;
        if (!packId) {
            return true;
        }

        const pack = game.packs.get(packId);
        const filterTypes = pack?.metadata?.flags?.filter?.type;
        if (!filterTypes || filterTypes.includes(itemType)) {
            return true;
        }

        const filterTypesMessage = filterTypes.map(type => localizeType(`Item.${type}`)).join(', ');
        NotificationsUtils._warning(`Este pacote só aceita itens do tipo '${filterTypesMessage}'.`);
        item.delete();

        return false;
    }

    static async #operateItemCreated(item) {
        if (item.system.isEquipment) {
            EquipmentRepository.addItem(item);
        }
    }
}