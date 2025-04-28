import { localize } from "../../../scripts/utils/utils.mjs";

export class Setor0TokenDocument extends CONFIG.Token.documentClass {
    static mappedLabel = new Map();

    static getTrackedAttributeChoices() {
        const preset = super.getTrackedAttributeChoices();
        const mappedItems = preset.map(item => {
            const itemLabel = item.label;
            return {
                group: item.group,
                value: item.value,
                label: this.mappedLabel.has(itemLabel) ? localize(this.mappedLabel.get(itemLabel)) : itemLabel
            }
        });
        return mappedItems;
    }
}

export async function configureSetor0TokenDocument() {
    CONFIG.Token.documentClass = Setor0TokenDocument;
}