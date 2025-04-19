import { getObject, TODO } from "../../../../scripts/utils/utils.mjs";
import { SYSTEM_ID, REGISTERED_TEMPLATES } from "../../../constants.mjs";
import { CreateRollableTestDialog } from "../../../creators/dialog/create-roll-test-dialog.mjs";
import { NotificationsUtils } from "../../../creators/message/notifications.mjs";
import { EquipmentCharacteristicType } from "../../../enums/equipment-enums.mjs";
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
                    if (!rollable.name) {
                        NotificationsUtils._error("O Teste precisa de um nome");
                        return;
                    }

                    const current = getObject(item, EquipmentCharacteristicType.POSSIBLE_TESTS) || [];
                    current.push(rollable);

                    const characteristicToUpdate = {
                        [EquipmentCharacteristicType.POSSIBLE_TESTS.system]: current
                    }

                    if (current.length == 1) {
                        characteristicToUpdate[EquipmentCharacteristicType.POSSIBLE_TESTS.system] = rollable.id;
                    }

                    await item.update(characteristicToUpdate);
                };

                CreateRollableTestDialog._open(null, onConfirm);
            },
            [OnEventType.VIEW]: async (item, event) => {
                const containerList = event.currentTarget.parentElement.parentElement.parentElement.querySelector('#rollable-tests-list');
                HtmlJsUtils.flipClasses(event.currentTarget.children[0], 'fa-chevron-up', 'fa-chevron-down');
                const expandResult = HtmlJsUtils.expandOrContractElement(containerList, { minHeight: this.defaultHeight, maxHeight: 640 });
                this.isExpandedTests = expandResult.isExpanded;
                this.newHeight = expandResult.newHeight;
            },
        }
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

            const windowElem = content.closest(".window-app");
            const height = windowElem?.offsetHeight;
            console.log("Altura final real da ficha:", height);
        });
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