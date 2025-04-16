import { SYSTEM_ID, REGISTERED_TEMPLATES } from "../../../constants.mjs";
import { OnEventTypeClickableEvents } from "../../../enums/characteristic-enums.mjs";
import { FlagsUtils } from "../../../utils/flags-utils.mjs";

export class EquipmentSheet extends ItemSheet {
    #mapEvents = {
        menu: {
            check: async (item, event) => {
                const type = event.currentTarget.dataset.type;
                switch (type) {
                    case 'edit': {
                        const actualMode = item.getFlag(SYSTEM_ID, 'editable');
                        FlagsUtils.setItemFlag(item, 'editable', !actualMode);
                        return;
                    }
                    case 'color': {
                        const actualMode = FlagsUtils.getGameUserFlag(game.user, 'darkMode') || false;
                        await FlagsUtils.setGameUserFlag(game.user, 'darkMode', !actualMode);
                        this.render();
                        return;
                    }
                }
            }
        },
    };

    constructor(...args) {
        super(...args);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["setor0OSubmundo", "sheet", "item"],
            template: `systems/setor0OSubmundo/templates/items/default.hbs`,
            width: 300,
            height: 500
        });
    }

    get template() {
        const type = this.item.type.toLowerCase();
        const path = `systems/setor0OSubmundo/templates/items/${type}.hbs`;

        if (REGISTERED_TEMPLATES.has(path)) {
            return path;
        }

        return `systems/setor0OSubmundo/templates/items/default.hbs`
    }

    getData() {
        const data = super.getData();
        const item = this.item;
        data.canEdit = game.user.isGM || item.getFlag(SYSTEM_ID, 'canEdit');

        return {
            ...data,
            item,
            system: item.system
        };
    }

    get isEditable() {
        return this.item.getFlag(SYSTEM_ID, 'editable') || false;
    }

    activateListeners(html) {
        super.activateListeners(html);
        this.#setupListeners(html);
        this.#presetSheet(html);
    }

    #presetSheet(html) {
        const actualMode = FlagsUtils.getGameUserFlag(game.user, 'darkMode') || false;
        const parent = html.parent()[0];
        parent.classList.toggle('S0-page-transparent', actualMode);
        parent.style.margin = '0';
        parent.style.paddingBlock = '0';
    }

    #setupListeners(html) {
        const actionsClick = OnEventTypeClickableEvents.map(eventType => ({
            selector: `[data-action="${eventType.id}"]`,
            method: this.#onActionClick
        }));

        actionsClick.forEach(action => {
            html.find(action.selector).click(action.method.bind(this, html));
        });
    }

    #onActionClick(html, event) {
        this.#onEvent(event.currentTarget.dataset.action, html, event);
    }

    #onEvent(action, html, event) {
        event.preventDefault();
        const characteristic = event.currentTarget.dataset.characteristic;
        const method = this.#mapEvents[characteristic]?.[action];
        if (method) {
            method(this.item, event);
        } else {
            console.warn(`-> [${action}] não existe para: [${characteristic}]`);
        }
    }
}

export async function itemsHtmlTemplateRegister() {
    await configurePartialTemplates();

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("setor0OSubmundo", EquipmentSheet, {
        types: ["Melee", "Projectile", "Armor", "Vehicle", "Substance"],
        makeDefault: true
    });
}

async function configurePartialTemplates() {
    const itemTemplateNames = [
        "armor",
        "melee",
        "projectile",
        "substance",
        "vehicle",
        "common-equipment"
    ];

    const itemTemplatePaths = itemTemplateNames.map(name =>
        `systems/setor0OSubmundo/templates/items/${name}.hbs`
    );

    await loadTemplates(itemTemplatePaths);

    for (const path of itemTemplatePaths) {
        REGISTERED_TEMPLATES.add(path);
    }

    const partials = [];
    if (partials.length > 0) {
        const results = await Promise.all(partials.map(async ({ call, path }) => {
            const fullPath = `systems/setor0OSubmundo/templates/${path}.hbs`;

            if (!Handlebars.partials[fullPath]) {
                return { Partial: call, Status: "Falha (não encontrado)", Path: fullPath };
            }

            Handlebars.registerPartial(call, Handlebars.partials[fullPath]);
            return { Partial: call, Status: "Sucesso", Path: fullPath };
        }));

        console.table(results);
    }
}