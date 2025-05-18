import { localize } from "../../scripts/utils/utils.mjs";

export class FameRepository {
    static #characteristics = [
        { id: 'nucleo', label: 'Nucleo' },
        { id: 'influencia', label: 'Influencia' },
        { id: 'nivel_de_procurado', label: 'Procurado' }
    ];

    static _getItems() {
        return [... this.#characteristics]
            .map(item => {
                return {
                    ...item,
                    label: localize(item.label)
                };
            });
    }

    static _getItemsNpc() {
        return FameRepository._getItems().filter(item => item.id != 'nucleo')
    }
}