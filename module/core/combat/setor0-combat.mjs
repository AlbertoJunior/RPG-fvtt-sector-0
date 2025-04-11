import { ActorUtils } from "../../../scripts/utils/actor.mjs";
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
}

export async function configureSetor0Combat() {
    CONFIG.Combat.documentClass = Setor0Combat;
}