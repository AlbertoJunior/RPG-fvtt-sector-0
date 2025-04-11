export class CreateItemHookHandle {
    static async handle(item) {
        this.#validateItemAgainstPackFilter(item);
    }

    static async #validateItemAgainstPackFilter(item) {
        const { pack: packId, type: itemType } = item;
        if (!packId) {
            return;
        }

        const pack = game.packs.get(packId);
        const filterTypes = pack?.metadata?.flags?.filter?.type;
        if (!filterTypes || filterTypes.includes(itemType)) {
            return;
        }

        const filterTypesMessage = filterTypes.map(type => localizeType(`Item.${type}`)).join(', ');
        NotificationsUtils._warning(`Este pacote só aceita itens do tipo '${filterTypesMessage}'.`);
        item.delete();
    }
}