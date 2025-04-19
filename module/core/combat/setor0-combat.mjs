import { ActorUtils } from "../../utils/actor-utils.mjs";
import { DefaultActions } from "../../utils/default-actions.mjs";

class Setor0Combat extends Combat {
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
        } else {
            super.rollInitiative(combatantIdArray);
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

    async startCombat() {
        return super.startCombat();
    }

    async nextTurn() {
        return super.nextTurn();
    }

    async previousTurn() {
        return super.previousTurn();
    }

    async nextRound() {
        return super.nextRound();
    }

    async previousRound() {
        return super.previousRound();
    }

    async endCombat() {
        return super.endCombat();
    }

    async delete() {
        await this.#removeActorCombatEffects();
        return super.delete();
    }

    async #removeActorCombatEffects() {
        for (const combatant of this.combatants) {
            const actor = combatant.actor;
            if (!actor) {
                continue;
            }

            const effectsToRemove = actor.effects.filter(effect => {
                const duration = effect.duration;
                return duration?.combat?.id === this.id;
            });

            await Promise.all(effectsToRemove.map(effect => effect.delete()));
        }
    }
}

export async function configureSetor0Combat() {
    CONFIG.Combat.documentClass = Setor0Combat;
}