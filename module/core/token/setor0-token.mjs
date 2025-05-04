import { localize } from "../../../scripts/utils/utils.mjs";

export class Setor0TokenDocument extends CONFIG.Token.documentClass {
    static #mappedLabel = new Map();

    static setValuesOnMapped(values = []) {
        const isValid = value => value && value.trim() !== '';

        values.forEach(({ id, label }) => {
            if (isValid(id) && isValid(label)) {
                this.#mappedLabel.set(id, label);
            }
        });
    }

    static getTrackedAttributeChoices() {
        const preset = super.getTrackedAttributeChoices();
        const mappedItems = preset.map(item => {
            const itemLabel = item.label;
            return {
                group: item.group,
                value: item.value,
                label: this.#mappedLabel.has(itemLabel) ? localize(this.#mappedLabel.get(itemLabel)) : itemLabel
            }
        });
        return mappedItems;
    }
}

export async function configureSetor0TokenDocument() {
    CONFIG.Token.documentClass = Setor0TokenDocument;
}