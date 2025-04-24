export class VirtuesRepository {
    static #characteristics = [
        { id: 'consciencia', label: 'S0.Consciencia' },
        { id: 'perseveranca', label: 'S0.Perseveranca' },
        { id: 'quietude', label: 'S0.Quietude' }
    ];

    static _getItems() {
        return [... this.#characteristics].sort((a, b) => a.label.localeCompare(b.label));
    }
}