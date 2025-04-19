import { SYSTEM_ID, REGISTERED_TEMPLATES } from "../../../constants.mjs";
import { CreateRollableTestDialog } from "../../../creators/dialog/create-roll-test-dialog.mjs";
import { OnEventType, OnEventTypeClickableEvents } from "../../../enums/on-event-type.mjs";
import { FlagsUtils } from "../../../utils/flags-utils.mjs";
import { HtmlJsUtils } from "../../../utils/html-js-utils.mjs";
import { handlerEquipmentItemRollEvents } from "./methods/equipment-item-roll-methods.mjs";

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
        menu_roll: {
            [OnEventType.ADD]: async (item, event) => {
                const onConfirm = async (rollable) => {
                    const current = item.system.possible_tests || [];
                    current.push(rollable);

                    const characteristicToUpdate = {
                        "system.possible_tests": current
                    }

                    if (current.length == 1) {
                        characteristicToUpdate["system.default_test"] = rollable.id;
                    }

                    await item.update(characteristicToUpdate);
                };

                CreateRollableTestDialog._open(null, onConfirm);
            },
            [OnEventType.VIEW]: async (item, event) => {
                const containerList = event.currentTarget.parentElement.parentElement.parentElement.querySelector('#rollable-tests-list');
                this.isExpanded = HtmlJsUtils.expandOrContractElement(containerList, { minHeight: this.minWindowHeight, maxHeight: 640, marginBottom: 0 });
            },
        }
    };

    constructor(...args) {
        super(...args);
        this.minWindowHeight = null;
        this.isExpanded = false;
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

        if (!this.minWindowHeight) {
            const windowElem = html.closest(".window-app");
            this.minWindowHeight = windowElem.height();
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

        html.find('#rollable-tests-list').toggleClass('S0-expanded', this.isExpanded)
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