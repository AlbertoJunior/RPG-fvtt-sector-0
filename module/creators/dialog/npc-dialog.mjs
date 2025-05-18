import { npcRollHandle } from "../../base/sheet/npc/methods/npc-roll-methods.mjs";
import { NpcSheetSize } from "../../base/sheet/npc/npc-sheet.mjs";
import { TEMPLATES_PATH } from "../../constants.mjs";
import { OnEventType } from "../../enums/on-event-type.mjs";
import { DialogUtils } from "../../utils/dialog-utils.mjs";

export class NpcDialog {
    static #mapEvents = {
        skill: npcRollHandle,
        img: {
            [OnEventType.VIEW]: async (actor, event) => {
                DialogUtils.showArtWork(actor.name, actor.img, true, actor.uuid);
            }
        }
    }

    static async open(npcInformations) {
        const content = await this.#mountContent(npcInformations);
        const actor = npcInformations.actor;

        new Dialog(
            {
                title: actor.name,
                content: content,
                buttons: {},
                render: (html) => this.#render(html, actor),
            },
            {
                height: NpcSheetSize.height,
                width: NpcSheetSize.width,
            }
        ).render(true);
    }

    static async #mountContent(npcActor) {
        return await renderTemplate(`${TEMPLATES_PATH}/npc/npc-sheet.hbs`, npcActor);
    }

    static #render(html, npcActor) {
        const params = {
            content: {
                background: 'none',
                padding: '0px'
            }
        };

        DialogUtils.presetDialogRender(html, params);

        Object.values(OnEventType)
            .filter(event => event != 'contextual' && event != 'check_contextual' && event != 'change')
            .map(eventType => (
                {
                    selector: `[data-action="${eventType}"]`,
                    method: NpcDialog.#onActionClick
                }
            ))
            .forEach(action => html.find(action.selector).click(action.method.bind(this, html, npcActor)));
    }

    static async #onActionClick(html, npcActor, event) {
        event.preventDefault();

        const dataset = event.currentTarget.dataset;
        const characteristic = dataset.characteristic;
        const action = dataset.action;
        const method = this.#mapEvents[characteristic]?.[action];
        if (method) {
            method(npcActor, event, html);
        } else {
            console.warn(`-> [${action}] não existe para: [${characteristic}]`);
        }
    }
}