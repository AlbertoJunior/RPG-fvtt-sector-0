import { TODO } from "../../../../scripts/utils/utils.mjs";

export class EquipmentSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["setor0OSubmundo", "sheet", "item"],
            template: `systems/setor0OSubmundo/templates/items/default.hbs`,
            width: 250,
            height: 400
        });
    }

    get template() {
        const type = this.item.type.toLowerCase();
        const path = `systems/setor0OSubmundo/templates/items/${type}.hbs`;

        TODO('implementar fallback, para isso precisa registrar todos os hbs no sistema.')
        // if (CONFIG.setor0OSubmundo?.registeredTemplates?.includes(path)) {
        return path;
        // }

        // return `systems/setor0OSubmundo/templates/items/default.hbs`
    }

    getData() {
        const data = super.getData();
        const item = this.item;

        return {
            ...data,
            item,
            system: item.system
        };
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}

export async function itemsHtmlTemplateRegister() {
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("setor0OSubmundo", EquipmentSheet, {
        types: ["Melee", "Projectile", "Armor", "Vehicle", "Substance"],
        makeDefault: true
    });
}