import { SYSTEM_ID, REGISTERED_TEMPLATES } from "../../../constants.mjs";
import { OnEventType, OnEventTypeClickableEvents } from "../../../enums/on-event-type.mjs";
import { FlagsUtils } from "../../../utils/flags-utils.mjs";
import { HtmlJsUtils } from "../../../utils/html-js-utils.mjs";
import { handlerEquipmentItemRollEvents } from "./methods/equipment-item-roll-methods.mjs";
import { handlerEquipmentMenuRollEvents } from "./methods/equipment-menu-roll-methods.mjs";

export class EquipmentSheet extends ItemSheet {
    #mapEvents = {
        menu: {
            [OnEventType.CHECK]: async (item, event) => {
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
        item_roll: handlerEquipmentItemRollEvents,
        menu_roll: handlerEquipmentMenuRollEvents
    };

    constructor(...args) {
        super(...args);
        this.isExpandedTests = false;
        this.defaultHeight = undefined;
        this.newHeight = undefined;
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

    #setupListeners(html) {
        const actionsClick = OnEventTypeClickableEvents.map(eventType => (
            {
                selector: `[data-action="${eventType}"]`,
                method: this.#onActionClick
            }
        ));

        actionsClick.forEach(action => html.find(action.selector).click(action.method.bind(this, html)));
    }

    #onActionClick(html, event) {
        this.#onEvent(event.currentTarget.dataset.action, html, event);
    }

    #onEvent(action, html, event) {
        event.preventDefault();
        const characteristic = event.currentTarget.dataset.characteristic;
        const method = this.#mapEvents[characteristic]?.[action];
        if (method) {
            method(this.item, event, html);
        } else {
            console.warn(`-> [${action}] não existe para: [${characteristic}]`);
        }
    }

    #presetSheet(html) {
        const actualMode = FlagsUtils.getGameUserFlag(game.user, 'darkMode') || false;
        const parent = html.parent()[0];
        parent.classList.toggle('S0-page-transparent', actualMode);
        parent.style.margin = '0';
        parent.style.paddingBlock = '0';
        parent.style.paddingLeft = '20px';
        parent.style.overflowY = 'scroll';

        this.#presetSheetExpandContainer(html);
    }

    #presetSheetExpandContainer(html) {
        html.find('#rollable-tests-list').toggleClass('S0-expanded', this.isExpandedTests);
        if (this.isExpandedTests && html.find('.fa-chevron-down').length > 0) {
            HtmlJsUtils.flipClasses(html.find('.fa-chevron-down')[0], 'fa-chevron-up', 'fa-chevron-down');
        }

        requestAnimationFrame(() => {
            const content = html.parent().parent()[0];
            if (!this.defaultHeight) {
                const windowElem = content.closest(".window-app");
                this.defaultHeight = windowElem?.offsetHeight;
            }

            if (this.isExpandedTests) {
                content.style.height = `${Math.max(this.defaultHeight, this.newHeight)}px`
            }
        });
    }
}

export async function itemsHtmlTemplateRegister() {
    await configurePartialTemplates();
    await Items.unregisterSheet("core", ItemSheet);
    await Items.registerSheet("setor0OSubmundo", EquipmentSheet, {
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
        "common-equipment",
        "rollable-tests"
    ];

    const itemTemplatePaths = itemTemplateNames.map(name =>
        `systems/setor0OSubmundo/templates/items/${name}.hbs`
    );

    await loadTemplates(itemTemplatePaths);

    for (const path of itemTemplatePaths) {
        REGISTERED_TEMPLATES.add(path);
    }

    const partials = [];
    const results = await Promise.all(partials.map(async ({ call, path }) => {
        const fullPath = `systems/setor0OSubmundo/templates/${path}.hbs`;

        if (!Handlebars.partials[fullPath]) {
            return { Partial: call, Status: "Falha (não encontrado)", Path: fullPath };
        }

        Handlebars.registerPartial(call, Handlebars.partials[fullPath]);
        return { Partial: call, Status: "Sucesso", Path: fullPath };
    }));

    const errors = results.filter(r => r.Status !== "Sucesso").length;
    if (errors > 0) {
        console.error(`Erros [${errors}] ao carregar partials.`)
    }
    console.table(results);
}