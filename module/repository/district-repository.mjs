import { SYSTEM_ID } from "../constants.mjs";

export class DistrictRepository {
    static items = [
        { id: 'alfiran', label: 'Alfiran' },
        { id: 'ameisen', label: 'Ameisen' },
        { id: 'aranhas', label: 'Aranhas' },
        { id: 'ptitsy', label: 'Ptitsy' },
        { id: 'tokojirami', label: 'Tokojirami' },
        { id: 'vyura', label: 'Vyura' },
    ];

    static #loadedFromPack = [];

    static async _loadFromPack() {
        const compendium = await game.packs.get(`${SYSTEM_ID}.districts`)?.getDocuments();
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

    static #getBaseItems() {
        return [... this.items];
    }

    static _getItems() {
        return [... this.#getBaseItems(), ...this.#loadedFromPack].sort((a, b) => a.label.localeCompare(b.label));
    }
}