import { SYSTEM_ID, REGISTERED_TEMPLATES } from "../../../constants.mjs";
import { OnEventTypeClickableEvents } from "../../../enums/on-event-type.mjs";
import { FlagsUtils } from "../../../utils/flags-utils.mjs";
import { HtmlJsUtils } from "../../../utils/html-js-utils.mjs";
import { loadAndRegisterTemplates } from "../../../utils/templates.mjs";
import { menuHandleMethods } from "../../menu-default-methods.mjs";
import { handlerEquipmentItemRollEvents } from "./methods/equipment-item-roll-methods.mjs";
import { handlerEquipmentMenuRollEvents } from "./methods/equipment-menu-roll-methods.mjs";

export class EquipmentSheet extends ItemSheet {
    #mapEvents = {
        menu: menuHandleMethods,
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
            classes: [SYSTEM_ID, "sheet", "item"],
            template: `systems/setor0OSubmundo/templates/items/default.hbs`,
            width: 320,
            height: 620
        });
    }

    get template() {
        const type = this.item.type.toLowerCase();
        const path = `systems/${SYSTEM_ID}/templates/items/${type}.hbs`;

        if (REGISTERED_TEMPLATES.has(path)) {
            return path;
        }

        return `systems/${SYSTEM_ID}/templates/items/default.hbs`
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
        return FlagsUtils.getItemFlag(this.item, 'editable', false);
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
        HtmlJsUtils.setupContent(html);
        HtmlJsUtils.setupHeader(html);
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

export async function equipmentTemplatesRegister() {
    const templates = [
        { path: "items/armor" },
        { path: "items/acessory" },
        { path: "items/melee" },
        { path: "items/projectile" },
        { path: "items/substance" },
        { path: "items/vehicle" },
        { path: "items/common-equipment" },
        { path: "items/rollable-tests" }
    ];

    return await loadAndRegisterTemplates(templates);
}

export async function registerEquipment() {
    await Items.unregisterSheet("core", ItemSheet);
    await Items.registerSheet(SYSTEM_ID, EquipmentSheet, {
        types: ["Melee", "Projectile", "Armor", "Vehicle", "Substance", "Acessory"],
        makeDefault: true
    });
}