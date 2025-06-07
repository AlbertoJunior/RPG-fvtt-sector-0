import { SYSTEM_ID } from "../constants.mjs";

export class RepertoryRepository {
    static items = [
        { id: 'aliados', label: 'S0.Aliados' },
        { id: 'arsenal', label: 'S0.Arsenal' },
        { id: 'informantes', label: 'S0.Informantes' },
        { id: 'recursos', label: 'S0.Recursos' },
        { id: 'superequipamentos', label: 'S0.SuperEquipamentos' }
    ];

    static #loadedFromPack = [];

    static async _loadFromPack() {
        const compendium = await game.packs.get(`${SYSTEM_ID}.repertories`)?.getDocuments();
        if (compendium) {
            EnhancementRepository.#loadedFromPack = compendium.map((item) => {
                return {
                    id: item._id,
                    label: item.name,
                    description: item.description
                };
            });
        }
    }

    static _getItems() {
        return [... this.items, ...this.#loadedFromPack].sort((a, b) => a.label.localeCompare(b.label));
    }
}