export class LanguageRepository {
    static #languages = [
        { id: 'domini', label: 'Domini', checked: true, district: 'Colméia', color: '#ed7d31' },
        { id: 'ameinsprache', label: 'Ameinsprache', district: 'Ameisen', color: '#c00000' },
        { id: 'aranhes', label: 'Aranhês', district: 'Aranhas', color: '#ffd965' },
        { id: 'bantura', label: 'Bantura', district: 'Vyura', color: '#2e75b5' },
        { id: 'kemyura', label: 'Kemyura', district: 'Vyura', color: '#2e75b5' },
        { id: 'dameise', label: 'L\'Ameise', district: 'Ameisen', color: '#c00000' },
        { id: 'ptikor', label: 'Ptikor', district: 'Ptitsy', color: '#548135' },
        { id: 'ptisyan', label: 'Ptisyan', district: 'Ptitsy', color: '#548135' },
        { id: 'tokojhae', label: 'Tokojhae', district: 'Tokojirami', color: '#7030a0' },
        { id: 'tokuma', label: 'Tokumá', district: 'Tokojirami', color: '#7030a0' },
        { id: 'zuarur', label: 'Zu\'arur', district: 'Alfiran', color: '#262626' },
    ];

    static #loadedFromPack = [];

    static async _loadFromPack() {
        const compendium = await game.packs.get('setor0OSubmundo.language')?.getDocuments();
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