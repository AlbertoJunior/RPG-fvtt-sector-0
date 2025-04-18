export class AttributeRepository {
    static #characteristics = [
        { id: 'forca', label: 'S0.Forca' },
        { id: 'destreza', label: 'S0.Destreza' },
        { id: 'vigor', label: 'S0.Vigor' },
        { id: 'percepcao', label: 'S0.Percepcao' },
        { id: 'carisma', label: 'S0.Carisma' },
        { id: 'inteligencia', label: 'S0.Inteligencia' }
    ];

    static _getItems() {
        return [... this.#characteristics];
    }
}