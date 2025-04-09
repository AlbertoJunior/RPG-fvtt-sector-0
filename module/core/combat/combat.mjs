import { ActorUtils } from "../../../scripts/utils/actor.mjs";
import { DefaultActions } from "../../utils/default-actions.mjs";

export class CombatUtils {
    static async addOrUpdateActorOnCombat(actor, initiative, hidden = false) {
        const currentCombat = game.combat;
        if (!currentCombat) {
            return;
        }

        if (!actor) {
            return;
        }

        const token = canvas.tokens.placeables.find(t => t.actor.id === actor.id);
        if (!token) {
            return;
        }

        const existingCombatant = currentCombat.combatants.find(c => c.actor.id === actor.id);
        if (existingCombatant) {
            await existingCombatant.update({ initiative: initiative });
        } else {
            await this.#add({ token: token, actor: actor, hidden: hidden, initiative: initiative });
        }
    }

    static async #add(params) {
        const { token, actor, hidden, initiative } = params;
        const combatant = {
            tokenId: token.id,
            sceneId: token.scene.id,
            actorId: actor.id,
            hidden: hidden,
            initiative: initiative
        }

        await currentCombat.createEmbeddedDocuments("Combatant", [combatant]);
    }
}

export class Setor0Combat extends Combat {
    getData() {
        const data = super.getData();
        return data;
    }

    async rollInitiative(combatantIdArray) {
        if (combatantIdArray) {
            for (const combatantId of combatantIdArray) {
                const combatant = this.combatants.get(combatantId);
                const actor = combatant.actor;
                await DefaultActions.processInitiativeRoll(actor);
            }
        }
    }

    _getInitiativeFormula(combatant) {
        const actor = combatant.actor;
        const formula = this.constructor.defaultInitiative;
        if (!actor) {
            return formula;
        }

        return formula + ActorUtils.calculateInitiative(actor);
    }
}