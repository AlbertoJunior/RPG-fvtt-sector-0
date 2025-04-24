import { CharacteristicType } from "../enums/characteristic-enums.mjs";
import { getObject } from "../../scripts/utils/utils.mjs";

export class ActorUtils {
    static getAttributeValue(actor, attr) {
        const base = getObject(actor, CharacteristicType.ATTRIBUTES)[attr] || 0;
        const bonus = getObject(actor, CharacteristicType.BONUS.ATTRIBUTES)[attr] || 0;
        return base + bonus;
    }

    static getAbilityValue(actor, ability) {
        const base = getObject(actor, CharacteristicType.ABILITY)[ability] || 0;
        const bonus = getObject(actor, CharacteristicType.BONUS.ABILITY)[ability] || 0;
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
        const stamina = getObject(actor, CharacteristicType.ATTRIBUTES.STAMINA);
        const letalDamage = getObject(actor, CharacteristicType.VITALITY.LETAL_DAMAGE);
        const calculatedMax = Math.max(letalDamage - stamina, 0);
        return Math.min(calculatedMax, 4);
    }

    static calculateVitalityByUpAttribute(actor, level) {
        const value = level;
        const bonus = getObject(actor, CharacteristicType.BONUS.VITALITY);
        return 5 + value + bonus;
    }

    static calculateMovimentPoints(actor) {
        const dexValue = this.getAttributeValue(actor, CharacteristicType.ATTRIBUTES.DEXTERITY.id);
        const athleticsValue = this.getAbilityValue(actor, 'atletismo');
        const bonusPM = getObject(actor, CharacteristicType.BONUS.PM) || 0;
        return 1 + athleticsValue + bonusPM + Math.floor(dexValue / 2);
    }

    static calculateInitiative(actor) {
        const dexValue = this.getAttributeValue(actor, CharacteristicType.ATTRIBUTES.DEXTERITY.id);
        const perValue = this.getAttributeValue(actor, CharacteristicType.ATTRIBUTES.PERCEPTION.id);
        const bonusInitiative = getObject(actor, CharacteristicType.BONUS.INITIATIVE) || 0;
        return bonusInitiative + Math.floor((dexValue + perValue) / 2);
    }

    static calculateTotalLanguages(actor) {
        const streetWise = getObject(actor, CharacteristicType.ABILITY.STREETWISE);
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
        return canvas.tokens.placeables.find(t => t.actor?.id === actor.id);
    }

    static getAllEnhancements(actor) {
        return Object.values(getObject(actor, CharacteristicType.ENHANCEMENT_ALL)).filter(enhancement => enhancement.id !== '') || [];
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