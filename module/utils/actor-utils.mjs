import { CharacteristicType } from "../enums/characteristic-enums.mjs";
import { getObject } from "../../scripts/utils/utils.mjs";

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
        const bonus = system.bonus.habilidades[ability] || 0;
        return base + bonus;
    }

    static getOverload(actor) {
        return getObject(actor, CharacteristicType.OVERLOAD) || 0;
    }

    static getEnhancementLevel(actor, enhancement) {
        const enhancements = getObject(actor, CharacteristicType.ENHANCEMENT_ALL);
        const enhancementOnActor = this.#findEnhancementOnActorById(enhancement.id, enhancements);
        const levelsOnActor = this.#findLevelsWithId(enhancementOnActor);
        return levelsOnActor.length;
    }

    static getDamage(actor) {
        const superficial = getObject(actor, CharacteristicType.VITALITY.SUPERFICIAL_DAMAGE) || 0;
        const letal = getObject(actor, CharacteristicType.VITALITY.LETAL_DAMAGE) || 0;
        return superficial + letal;
    }

    static getActualLanguages(actor) {
        return getObject(actor, CharacteristicType.LANGUAGE) || [];
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
        const bonusPM = getObject(actor, CharacteristicType.BONUS.PM) || 0;
        return 1 + athleticsValue + bonusPM + Math.floor(dexValue / 2);
    }

    static calculateInitiative(actor) {
        const dexValue = this.getAttributeValue(actor, 'destreza');
        const perValue = this.getAttributeValue(actor, 'percepcao');
        const bonusInitiative = getObject(actor, CharacteristicType.BONUS.INITIATIVE) || 0;
        return bonusInitiative + Math.floor((dexValue + perValue) / 2);
    }

    static calculateTotalLanguages(actor) {
        const abilities = getObject(actor, CharacteristicType.ABILITY);
        const streetWise = abilities.manha;
        if (streetWise == 0) {
            return 1;
        }

        if (streetWise == 1) {
            return 2;
        }

        return 1 + (streetWise - 1) * 2
    }

    static havePerseverance(actor) {
        const level = getObject(actor, CharacteristicType.VIRTUES.PERSEVERANCE.LEVEL);
        const used = getObject(actor, CharacteristicType.VIRTUES.PERSEVERANCE.USED);
        return used < level;
    }

    static getToken(actor) {
        return canvas.tokens.placeables.find(t => t.actor.id === actor.id);
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