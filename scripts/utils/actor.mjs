import { TODO } from "./utils.mjs";

export class ActorUtils {
    static getAttributeValue(actor, attr) {
        const system = actor.system;
        const base = system.atributos[attr] || 0;
        const bonus = system.bonus.atributos[attr] || 0;
        return base + bonus;
    }

    static getAbilityValue(actor, ability) {
        const system = actor.system;
        const base = system.habilidades[ability] || 0;
        TODO('colocar o campo de habilidades no bonus');
        //const bonus = system.bonus.habilidades[ability] || 0;
        return base;
    }

    static calculatePenalty(actor) {
        const system = actor.system;
        const stamina = system.atributos.vigor;
        const damage = system.vitalidade.dano_letal;
        const calculatedMinor = Math.max(damage - stamina, 0);
        return Math.min(calculatedMinor, 4);
    }
}