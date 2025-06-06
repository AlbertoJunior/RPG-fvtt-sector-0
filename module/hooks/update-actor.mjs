import { getObject } from "../../scripts/utils/utils.mjs";
import { ActorType, CharacteristicType } from "../enums/characteristic-enums.mjs";

export class UpdateActorHookHandle {
    static async handle(updatedActor, changes, options, userId) {
        if (updatedActor.type == ActorType.NPC) {
            await this.#handleNpcUpdate(updatedActor, changes, options, userId);
        }
    }

    static async #handleNpcUpdate(updatedActor, changes, options, userId) {
        const { name, img, system } = changes;
        if (!name && !img && !system) {
            return;
        }

        game.actors.forEach(actor => {
            const allies = getObject(actor, CharacteristicType.ALLIES) || [];
            const informants = getObject(actor, CharacteristicType.INFORMANTS) || [];
            const all = new Set([...allies, ...informants]);
            if (all.has(updatedActor.id)) {
                if (actor.sheet.rendered) {
                    actor.sheet.render(false);
                }
            }
        });
    }
}