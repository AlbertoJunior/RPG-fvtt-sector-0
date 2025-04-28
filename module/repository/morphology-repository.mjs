import { localize } from "../../scripts/utils/utils.mjs";
import { SYSTEM_ID } from "../constants.mjs";

export class MorphologyRepository {
    static items = [
        { id: 'androide', label: 'Androide' },
        { id: 'ciborgue', label: 'Ciborgue' },
        { id: 'sintetico', label: 'Sintetico' },
    ];

    static #loadedFromPack = [];

    static async _loadFromPack() {
        const compendium = await game.packs.get(`${SYSTEM_ID}.morphologies`)?.getDocuments();
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
        return [... this.items].map(item => {
            return {
                id: item.id,
                label: localize(item.label)
            }
        })
    }

    static _getItems() {
        return [... this.#getBaseItems(), ... this.#loadedFromPack].sort((a, b) => a.label.localeCompare(b.label));
    }
}