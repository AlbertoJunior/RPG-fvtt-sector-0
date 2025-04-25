export class RepertoryRepository {
    static #characteristics = [
        { id: 'aliados', label: 'S0.Aliados' },
        { id: 'arsenal', label: 'S0.Arsenal' },
        { id: 'informantes', label: 'S0.Informantes' },
        { id: 'recursos', label: 'S0.Recursos' },
        { id: 'superequipamentos', label: 'S0.SuperEquipamentos' }
    ];

    static _getItems() {
        return [... this.#characteristics].sort((a, b) => a.label.localeCompare(b.label));
    }
}