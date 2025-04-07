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

    static getOverload(actor) {
        return actor.system.sobrecarga || 0;
    }

    static calculatePenalty(actor) {
        const system = actor.system;
        const stamina = system.atributos.vigor;
        const damage = system.vitalidade.dano_letal;
        const calculatedMinor = Math.max(damage - stamina, 0);
        return Math.min(calculatedMinor, 4);
    }

    static calculateVitalityByUpAttribute(actor, level) {
        const system = actor.system;
        const value = level;
        const bonus = system.bonus.vitalidade || 0;
        return 5 + value + bonus;
    }

    static calculateMovimentPoints(actor) {
        const dexValue = this.getAttributeValue(actor, 'destreza');
        const athleticsValue = this.getAbilityValue(actor, 'atletismo');
        const bonusPM = actor.system.bonus.movimento || 0;
        return 1 + athleticsValue + bonusPM + Math.floor(dexValue / 2);
    }

    static calculateInitiative(actor) {
        const dexValue = this.getAttributeValue(actor, 'destreza');
        const perValue = this.getAttributeValue(actor, 'percepcao');
        const bonusInitiative = actor.system.bonus.iniciativa || 0;
        return bonusInitiative + Math.floor((dexValue + perValue) / 2);
    }

    static getEnhancementLevel(actor, enhancement) {
        const enhancementOnActor = this.#findEnhancementOnActorById(enhancement.id, actor.system.aprimoramentos);
        const levelsOnActor = this.#findLevelsWithId(enhancementOnActor);
        return levelsOnActor.length;
    }

    static #findEnhancementOnActorById(selectedId, enhancements) {
        if (!selectedId || !enhancements || typeof enhancements !== 'object') {
            return null;
        }

        for (const key in enhancements) {
            const enhancement = enhancements[key];
            if (enhancement && enhancement.id === selectedId) {
                return enhancement;
            }
        }

        return null;
    }

    static #findLevelsWithId(enhancement) {
        if (!enhancement || !enhancement.levels || typeof enhancement.levels !== 'object') {
            return [];
        }
        return Object.values(enhancement.levels).filter(level => level && level.id !== "");
    }
}