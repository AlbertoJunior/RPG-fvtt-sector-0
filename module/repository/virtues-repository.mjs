import { localize } from "../../scripts/utils/utils.mjs";

export class VirtuesRepository {
    static #characteristics = [
        { id: 'consciencia', label: 'Consciencia' },
        { id: 'perseveranca', label: 'Perseveranca' },
        { id: 'quietude', label: 'Quietude' }
    ];

    static getItems() {
        return [... this.#characteristics]
            .map(item => {
                return {
                    ...item,
                    label: localize(item.label)
                };
            })
            .sort((a, b) => a.label.localeCompare(b.label));
    }
}