import { SYSTEM_ID } from "../constants.mjs";

export class DistrictRepository {

    static TYPES = Object.freeze({
        COLMEIA: { id: 'colmeia', label: 'Colmeia' },
        ALFIRAN: { id: 'alfiran', label: 'Alfiran' },
        AMEISEN: { id: 'ameisen', label: 'Ameisen' },
        ARANHAS: { id: 'aranhas', label: 'Aranhas' },
        PTITSY: { id: 'ptitsy', label: 'Ptitsy' },
        TOKOJIRAMI: { id: 'tokojirami', label: 'Tokojirami' },
        VYURA: { id: 'vyura', label: 'Vyura' },
    });

    static #items = Object.values(DistrictRepository.TYPES);

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
        return [... this.#items].filter(district => district != DistrictRepository.TYPES.COLMEIA);
    }

    static getItems() {
        return [... this.#getBaseItems(), ...this.#loadedFromPack].sort((a, b) => a.label.localeCompare(b.label));
    }
}