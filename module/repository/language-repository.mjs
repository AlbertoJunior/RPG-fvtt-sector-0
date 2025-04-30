import { SYSTEM_ID } from "../constants.mjs";

export class LanguageRepository {
    static #languages = [
        { id: 'domini', label: 'Domini', checked: true, district: 'colmeia', color: '#ed7d31' },
        { id: 'ameinsprache', label: 'Ameinsprache', district: 'ameisen', color: '#c00000' },
        { id: 'aranhes', label: 'Aranhês', district: 'aranhas', color: '#ffd965' },
        { id: 'bantura', label: 'Bantura', district: 'vyura', color: '#2e75b5' },
        { id: 'kemyura', label: 'Kemyura', district: 'vyura', color: '#2e75b5' },
        { id: 'dameise', label: 'L\'Ameise', district: 'ameisen', color: '#c00000' },
        { id: 'ptikor', label: 'Ptikor', district: 'ptitsy', color: '#548135' },
        { id: 'ptisyan', label: 'Ptisyan', district: 'ptitsy', color: '#548135' },
        { id: 'tokojhae', label: 'Tokojhae', district: 'tokojirami', color: '#7030a0' },
        { id: 'tokuma', label: 'Tokumá', district: 'tokojirami', color: '#7030a0' },
        { id: 'zuarur', label: 'Zu\'arur', district: 'alfiran', color: '#262626' },
    ];

    static #loadedFromPack = [];

    static async _loadFromPack() {
        const compendium = await game.packs.get(`${SYSTEM_ID}.language`)?.getDocuments();
        if (compendium) {
            LanguageRepository.#loadedFromPack = compendium.map((item) => {
                return {
                    id: item._id,
                    label: item.name,
                    district: item.district,
                    checked: item.default
                };
            });
        }
    }

    static _getItems() {
        return [... this.#languages, ... this.#loadedFromPack];
    }
}