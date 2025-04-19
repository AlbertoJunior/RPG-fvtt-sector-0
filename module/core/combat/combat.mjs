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
            await this.#add(currentCombat, { token: token, actor: actor, hidden: hidden, initiative: initiative });
        }
    }

    static async #add(currentCombat, params) {
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