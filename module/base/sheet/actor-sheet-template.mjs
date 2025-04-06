import { _createLi } from "../../../scripts/creators/jscript/element-creator-jscript.mjs";
import { ActorUtils } from "../../../scripts/utils/actor.mjs";
import { getActorFlag, selectCharacteristic, setActorFlag } from "../../../scripts/utils/utils.mjs";
import { CharacteristicType, OnEventType } from "../../enums/characteristic-enums.mjs";
import { ActorUpdater } from "../updater/actor-updater.mjs";
import { enhancementHandleMethods, selectLevelOnOptions, updateEnhancementLevelsOptions } from "./enhancement-methods.mjs";
import { SheetMethods } from "./sheet-methods.mjs";

class Setor0ActorSheet extends ActorSheet {

    #mapEvents = {
        trait: SheetMethods.handleMethods.trait,
        enhancement: enhancementHandleMethods,
        linguas: SheetMethods.handleMethods.language,
        effects: SheetMethods.handleMethods.effects,
        temporary: SheetMethods.handleMethods.temporary
    };

    constructor(...args) {
        super(...args)
        this.currentPage = 1;
        this.enableBlackMode = false;
    }

    activateListeners(html) {
        super.activateListeners(html);
        SheetMethods._createDynamicSheet(html, this.isEditable);
        this.#presetSheet(html);
        this.#setupListeners(html);
        this.#addPageButtonsOnFloatingMenu(html);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["setor0OSubmundo", "sheet", "actor"],
            template: "systems/setor0OSubmundo/templates/actors/actor-sheet.hbs",
            width: 600,
            height: 870,
            resizable: false,
        });
    }

    getData() {
        const data = super.getData();
        data.editable = this.isEditable;
        data.canRoll = game.user.isGM || this.actor.isOwner;
        data.canEdit = game.user.isGM || this.actor.isOwner;
        return data;
    }

    get isEditable() {
        return getActorFlag(this.actor, "editable");
    }

    get canEdit() {
        return getActorFlag(this.actor, "canEdit");
    }

    get canRoll() {
        return getActorFlag(this.actor, "canRoll");
    }

    #setupListeners(html) {
        const actionsClick = [
            { selector: '#edit-mode-toggle', method: this.#toggleEditMode },
            { selector: '#roll-button', method: this.#openRollDialog },
            { selector: `[data-action="${OnEventType.CHARACTERISTIC.id}"]`, method: this.#characteristicOnClick },
            ...Object.values(OnEventType)
                .filter(eventType => eventType !== OnEventType.CHANGE && eventType !== OnEventType.CHARACTERISTIC)
                .map(eventType => ({
                    selector: `[data-action="${eventType.id}"]`,
                    method: this.#onActionClick
                }))
        ];
        const actionsChange = [
            { selector: `[data-action="${OnEventType.CHANGE.id}"]`, method: this.#onChange },
        ];
        const actionsContextMenu = [
            { selector: `[data-action="${OnEventType.CHECK.id}"]`, method: this.#onContextualClick }
        ];

        actionsClick.forEach(action => {
            html.find(action.selector).click(action.method.bind(this, html));
        });
        actionsChange.forEach(action => {
            html.find(action.selector).change(action.method.bind(this, html));
        });
        actionsContextMenu.forEach(action => {
            html.find(action.selector).on('contextmenu', action.method.bind(this, html));
        });
    }

    #addPageButtonsOnFloatingMenu(html) {
        const buttonContainer = html.find("#floating-menu")[0];
        const pages = [];
        const buttons = [];
        html.find(".S0-page").each((index, page) => {
            pages.push(page);

            const textContent = page?.getAttribute('data-label') || "[Erro]";
            const button = _createLi(textContent, { classList: 'S0-simulate-button' });

            buttonContainer.appendChild(button);

            buttons.push(button);
            button.addEventListener('click', this.#changePage.bind(this, index + 1, pages, buttons));

            if (index + 1 != this.currentPage) {
                page.classList.add('hidden');
            } else {
                button.classList.add('S0-selected');
            }
        });
    }

    async #toggleEditMode(html, event) {
        let currentValue = getActorFlag(this.actor, "editable");
        currentValue = !currentValue;

        await setActorFlag(this.actor, "editable", currentValue)
    }

    #presetSheet(html) {
        if (this.enableBlackMode) {
            const parent = html.parent()[0];
            parent.classList.add('S0-page-transparent')
        };

        const classesToRemove = [
            'S0-selected', 'S0-superficial', 'S0-letal'
        ];
        for (const item of classesToRemove) {
            html.find(`.${item}`).removeClass(item);
        }
        console.log('REMOVENDO TODOS OS ELEMENTOS COM S0-selected, S0-superficial e S0-letal');

        const system = this.actor.system;
        const activeEffects = this.actor.statuses;

        [
            {
                container: html.find('#atributosContainer')[0],
                systemCharacteristic: system.atributos
            },
            {
                container: html.find('#repertorioContainer')[0],
                systemCharacteristic: system.repertorio
            },
            {
                container: html.find('#habilidadesContainer')[0],
                systemCharacteristic: system.habilidades
            },
            {
                container: html.find('#famaContainer')[0],
                systemCharacteristic: system
            }
        ].forEach((element) => {
            let hasNext = element.container?.firstElementChild;
            while (hasNext) {
                const children = hasNext.querySelectorAll('.S0-characteristic');
                const level = element.systemCharacteristic[hasNext.id];
                selectCharacteristic(children[Math.min(level - 1, children.length - 1)]);
                hasNext = hasNext.nextElementSibling;
            }
        });

        const virtueContainer = html.find('#virtudesContainer')[0];
        let virtueElementChild = virtueContainer.firstElementChild;
        while (virtueElementChild) {
            selectCharacteristic(virtueElementChild.children[system.virtudes[virtueElementChild.id].level]);
            virtueElementChild = virtueElementChild.nextElementSibling;
        }

        const langContainer = html.find('#linguasContainer')[0].children;
        const langElements = Array.from(langContainer);
        system.linguas.forEach(language => {
            const langElement = langElements.find(el => el.id === language)?.querySelector('.S0-characteristic');

            if (langElement) {
                selectCharacteristic(langElement);
            }
        });

        html.find('.S0-enhancement').each((index, enhaceContainer) => {
            const enhancement = system.aprimoramentos[`aprimoramento_${index + 1}`];
            const selects = $(enhaceContainer).find('select');

            $(selects[0]).find('option').each((_, option) => {
                const itemId = option.dataset.itemId;
                if (itemId == enhancement.id) {
                    option.selected = true;
                    const levelSelects = selects.slice(1);
                    updateEnhancementLevelsOptions(itemId, levelSelects);
                    selectLevelOnOptions(enhancement, levelSelects, activeEffects);
                }
            });
        });

        selectCharacteristic(html.find('#statusPage #consciencia .S0-characteristic')[system.virtudes.consciencia.used - 1]);
        selectCharacteristic(html.find('#statusPage #perseveranca .S0-characteristic')[system.virtudes.perseveranca.used - 1]);
        selectCharacteristic(html.find('#statusPage #quietude .S0-characteristic')[system.virtudes.quietude.used - 1]);
        selectCharacteristic(html.find('#statusPage #sobrecarga .S0-characteristic')[system.sobrecarga - 1]);

        const life = html.find('#statusPage #vida .S0-characteristic');
        life.addClass('S0-selected');
        selectCharacteristic(life[system.vida]);

        let letalDamage = system.vitalidade.dano_letal || 0;
        let superFicialDamage = system.vitalidade.dano_superficial || 0;
        html.find('#vitalidade .S0-characteristic-temp').each((index, item) => {
            if (superFicialDamage > 0) {
                item.classList.add('S0-superficial');
                superFicialDamage--;
            } else if (letalDamage > 0) {
                item.classList.add('S0-letal');
                letalDamage--;
            } else {
                return;
            }
        });
    }

    async #characteristicOnClick(html, event) {
        const element = event.target;
        selectCharacteristic(element);

        const characteristicType = event.currentTarget.dataset.characteristic;
        const systemCharacteristic = SheetMethods.characteristicTypeMap[characteristicType];

        if (systemCharacteristic) {
            const parentElement = element.parentElement;
            const level = Array.from(parentElement.children).filter(el => el.classList.contains('S0-selected')).length;

            if (systemCharacteristic.includes('virtudes')) {
                const characteristic = `${systemCharacteristic}.${parentElement.id}.level`;
                ActorUpdater._verifyAndUpdateActor(this.actor, characteristic, level);
            } else {
                const params = [];
                params.push(
                    {
                        systemCharacteristic: `${systemCharacteristic}.${parentElement.id}`,
                        value: level
                    }
                );

                if (parentElement.id == 'vigor') {
                    params.push(
                        {
                            systemCharacteristic: CharacteristicType.VITALITY_TOTAL.system,
                            value: ActorUtils.calculateVitalityByUpAttribute(this.actor, level)
                        }
                    );
                }

                ActorUpdater._verifyKeysAndUpdateActor(this.actor, params);
            }
        }
    }

    async #onActionClick(html, event) {
        this.#onEvent(event.currentTarget.dataset.action, html, event);
    }

    async #onChange(html, event) {
        this.#onEvent('change', html, event);
    }

    async #onContextualClick(html, event) {
        this.#onEvent('contextual', html, event);
    }

    async #onEvent(action, html, event) {
        event.preventDefault();
        const characteristic = event.currentTarget.dataset.characteristic;
        const method = this.#mapEvents[characteristic]?.[action];
        if (method) {
            method(this.actor, event);
        } else {
            console.warn(`-> [${action}] não existe para: [${characteristic}]`);
        }
    }

    async #openRollDialog(html, event) {
        SheetMethods._openRollDialog(this.actor);
    }

    async #changePage(pageIndex, pages, buttons, event) {
        if (pageIndex == this.currentPage)
            return;

        const normalizedCurrentIndex = Math.max(this.currentPage - 1, 0);
        const normalizedIndex = Math.max(pageIndex - 1, 0);
        pages[normalizedCurrentIndex].classList.toggle('hidden');
        pages[normalizedIndex].classList.toggle('hidden');

        buttons[normalizedCurrentIndex].classList.toggle('S0-selected');
        buttons[normalizedIndex].classList.toggle('S0-selected');
        this.currentPage = pageIndex;
    }
}

export async function actorHtmlTemplateRegister() {
    await configurePartialTemplates();
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("Setor 0", Setor0ActorSheet, { makeDefault: true });
    console.log('-> Modelos de dados e fichas registrados');
}

async function configurePartialTemplates() {
    await loadTemplates([
        "actors/characteristics",
        "actors/biography",
        "actors/biography-trait-partial",
        "actors/status",
        "actors/enhancement",
        "actors/enhancement-partial",
    ].map(item => `systems/setor0OSubmundo/templates/${item}.hbs`));

    const partials = [
        { call: 'traitPartialContainer', path: 'actors/biography-trait-partial' }
    ];

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