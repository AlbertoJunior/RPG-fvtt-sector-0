import { selectCharacteristic } from "../../../../scripts/utils/utils.mjs";
import { SYSTEM_ID } from "../../../constants.mjs";
import { BaseActorCharacteristicType } from "../../../enums/characteristic-enums.mjs";
import { OnEventType, OnEventTypeClickableEvents, OnMethod, verifyAndParseOnEventType } from "../../../enums/on-event-type.mjs";
import { DialogUtils } from "../../../utils/dialog-utils.mjs";
import { FlagsUtils } from "../../../utils/flags-utils.mjs";
import { HtmlJsUtils } from "../../../utils/html-js-utils.mjs";
import { loadAndRegisterTemplates } from "../../../utils/templates.mjs";
import { menuHandleMethods } from "../../menu-default-methods.mjs";
import { ActorUpdater } from "../../updater/actor-updater.mjs";
import { npcRollHandle } from "./methods/npc-roll-methods.mjs";

export async function npcTemplatesRegister() {
    const templates = [
        { path: "npc/skill", call: "npcSkillPartial" },
    ];

    return await loadAndRegisterTemplates(templates);
}

export async function registerNpc() {
    await Actors.registerSheet(SYSTEM_ID, Setor0NpcSheet, {
        types: ["NPC"],
        makeDefault: true
    });
}

export const NpcSheetSize = {
    width: 680,
    height: 450,
}

class Setor0NpcSheet extends ActorSheet {
    #mapEvents = {
        menu: menuHandleMethods,
        skill: npcRollHandle,
        img: {
            [OnEventType.VIEW]: async (actor, event) => {
                DialogUtils.showArtWork(actor.name, actor.img, true, actor.uuid);
            }
        },
        influencia: {
            [OnEventType.CHARACTERISTIC]: async (actor, event) => {
                this.#updateCharacteristic(actor, BaseActorCharacteristicType.INFLUENCE, event.currentTarget);
            }
        },
        nivel_de_procurado: {
            [OnEventType.CHARACTERISTIC]: async (actor, event) => {
                this.#updateCharacteristic(actor, BaseActorCharacteristicType.BOUNTY, event.currentTarget);
            }
        }
    };

    constructor(...args) {
        super(...args);
        this.currentPage = 1;
    }

    getData() {
        const data = super.getData();
        data.editable = this.isEditable;
        data.canRoll = this.canRollOrEdit;
        data.canEdit = this.canRollOrEdit;
        return data;
    }

    get isEditable() {
        return (FlagsUtils.getActorFlag(this.actor, "editable") && this.canRollOrEdit) || false;
    }

    get canRollOrEdit() {
        return game.user.isGM || this.actor.isOwner;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: [SYSTEM_ID, "sheet", "actor"],
            template: "systems/setor0OSubmundo/templates/npc/npc-sheet.hbs",
            width: NpcSheetSize.width,
            height: NpcSheetSize.height,
            resizable: false,
        });
    }

    activateListeners(html) {
        super.activateListeners(html);
        this.#setupContentAndHeader(html);
        this.#setupListeners(html);
    }

    #setupContentAndHeader(html) {
        HtmlJsUtils.setupContent(html);
        HtmlJsUtils.setupHeader(html);
    }

    #setupListeners(html) {
        const actionsClick = [
            { selector: `[data-action="${OnEventType.CHARACTERISTIC}"]`, method: this.#onActionClick },
            ...OnEventTypeClickableEvents.map(eventType => ({ selector: `[data-action="${eventType}"]`, method: this.#onActionClick }))
        ];

        actionsClick.forEach(action => {
            html.find(action.selector).click(action.method.bind(this, html));
        });
    }

    async #onEvent(action, html, event) {
        event.preventDefault();
        const characteristic = event.currentTarget.dataset.characteristic;
        const method = this.#mapEvents[characteristic]?.[action];
        if (method) {
            method(this.actor, event, html);
        } else {
            console.warn(`-> [${action}] não existe para: [${characteristic}]`);
        }
    }

    async #onActionClick(html, event) {
        const action = verifyAndParseOnEventType(event.currentTarget.dataset.action, OnMethod.CLICK);
        this.#onEvent(action, html, event);
    }

    #updateCharacteristic(actor, characteristic, target) {
        selectCharacteristic(target);
        const level = target.parentElement.querySelectorAll('.S0-selected').length;
        ActorUpdater._verifyAndUpdateActor(actor, characteristic, level);
    }
}