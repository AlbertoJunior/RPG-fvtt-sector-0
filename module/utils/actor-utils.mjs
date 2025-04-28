import { CharacteristicType } from "../enums/characteristic-enums.mjs";
import { getObject, TODO } from "../../scripts/utils/utils.mjs";

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
        TODO('buscar nos efeitos se vai ter mais alguma penalidade')
        return Math.min(calculatedMax, 4);
    }

    static calculateVitalityByUpAttribute(actor, level) {
        const value = level;
        const bonus = getObject(actor, CharacteristicType.BONUS.VITALITY);
        return 5 + value + bonus;
    }

    static calculateDices(actor, attr1, attr2, ability) {
        const attr1Value = this.getAttributeValue(actor, attr1);
        const attr2Value = this.getAttributeValue(actor, attr2);
        const abilityValue = this.getAbilityValue(actor, ability);
        return Math.floor((attr1Value + attr2Value) / 2) + abilityValue;
    }

    static calculateMovimentPoints(actor) {
        const dexValue = this.getAttributeValue(actor, CharacteristicType.ATTRIBUTES.DEXTERITY.id);
        const athleticsValue = this.getAbilityValue(actor, CharacteristicType.ABILITY.ATHLETICS.id);
        const bonusPM = getObject(actor, CharacteristicType.BONUS.PM) || 0;
        const calculated = 1 + athleticsValue + bonusPM + Math.floor(dexValue / 2);
        return Math.max(calculated, 0);
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

    static calculateTotalExperience(actor) {
        const currentEperience = getObject(actor, CharacteristicType.EXPERIENCE.CURRENT);
        const usedExperience = getObject(actor, CharacteristicType.EXPERIENCE.USED);
        return currentEperience + usedExperience;
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

export class ActorCombatUtils {
    static dataPresetCombatMap = {
        brawl: {
            offensive: this.#makeOffensivePreset(
                CharacteristicType.ATTRIBUTES.STRENGTH,
                CharacteristicType.ATTRIBUTES.DEXTERITY,
                CharacteristicType.ABILITY.BRAWL,
                CharacteristicType.BONUS.OFENSIVE_MELEE
            ),
            defensive: this.#makeDefensivePreset(
                CharacteristicType.ATTRIBUTES.DEXTERITY,
                CharacteristicType.ATTRIBUTES.STAMINA,
                CharacteristicType.ABILITY.BRAWL
            )
        },
        melee: {
            offensive: this.#makeOffensivePreset(
                CharacteristicType.ATTRIBUTES.STRENGTH,
                CharacteristicType.ATTRIBUTES.DEXTERITY,
                CharacteristicType.ABILITY.MELEE,
                CharacteristicType.BONUS.OFENSIVE_MELEE
            ),
            defensive: this.#makeDefensivePreset(
                CharacteristicType.ATTRIBUTES.DEXTERITY,
                CharacteristicType.ATTRIBUTES.STAMINA,
                CharacteristicType.ABILITY.MELEE
            )
        },
        projectile: {
            offensive: this.#makeOffensivePreset(
                CharacteristicType.ATTRIBUTES.DEXTERITY,
                CharacteristicType.ATTRIBUTES.PERCEPTION,
                CharacteristicType.ABILITY.PROJECTILE,
                CharacteristicType.BONUS.OFENSIVE_PROJECTILE
            ),
            defensive: this.#makeDefensivePreset(
                CharacteristicType.ATTRIBUTES.DEXTERITY,
                CharacteristicType.ATTRIBUTES.STAMINA,
                CharacteristicType.ABILITY.ATHLETICS
            )
        }
    };

    static #makeOffensivePreset(attr1, attr2, ability, bonusType) {
        return {
            attr1: attr1.id,
            attr2: attr2.id,
            ability: ability.id,
            getBonus: (actor) => getObject(actor, bonusType) || 0
        };
    }

    static #makeDefensivePreset(attr1, attr2, ability) {
        const attr1Id = attr1.id;
        const attr2Id = attr2.id;
        const abilityId = ability.id;
        return {
            attr1: attr1Id,
            attr2: attr2Id,
            ability: abilityId,
            getBonus: (actor, dices) => {
                let safeDices = dices;
                if (!dices) {
                    safeDices = ActorUtils.calculateDices(actor, attr1Id, attr2Id, abilityId);
                }
                const bonus = getObject(actor, CharacteristicType.BONUS.DEFENSIVE);
                return Math.floor(safeDices * bonus);
            }
        };
    }

    static calculateOffensiveProjectileDices(actor) {
        const data = this.dataPresetCombatMap.projectile.offensive;
        return this.calculateOffensiveDices(actor, data);
    }

    static calculateOffensiveMeleeDices(actor) {
        const data = this.dataPresetCombatMap.melee.offensive;
        return this.calculateOffensiveDices(actor, data);
    }

    static calculateOffensiveBrawlDices(actor) {
        const data = this.dataPresetCombatMap.brawl.offensive;
        return this.calculateOffensiveDices(actor, data);
    }

    static calculateOffensiveDices(actor, data) {
        const bonus = data.getBonus(actor);
        return ActorUtils.calculateDices(actor, data.attr1, data.attr2, data.ability) + bonus;
    }

    static calculateDefensiveDodgeDices(actor) {
        const data = this.dataPresetCombatMap.projectile.defensive;
        return this.#calculateDefensiveDices(actor, data);
    }

    static calculateDefensiveHalfDodgeDices(actor) {
        const data = this.dataPresetCombatMap.projectile.defensive;
        return this.#calculateHalfDefensiveDices(actor, data);
    }

    static calculateDefensiveBlockMeleeDices(actor) {
        const data = this.dataPresetCombatMap.melee.defensive;
        return this.#calculateDefensiveDices(actor, data);
    }

    static calculateDefensiveHalfBlockMeleeDices(actor) {
        const data = this.dataPresetCombatMap.melee.defensive;
        return this.#calculateHalfDefensiveDices(actor, data);
    }

    static calculateDefensiveBlockBrawlDices(actor) {
        const data = this.dataPresetCombatMap.brawl.defensive;
        return this.#calculateDefensiveDices(actor, data);
    }

    static calculateDefensiveHalfBlockBrawlDices(actor) {
        const data = this.dataPresetCombatMap.brawl.defensive;
        return this.#calculateHalfDefensiveDices(actor, data);
    }

    static #calculateDefensiveDices(actor, data) {
        const dices = ActorUtils.calculateDices(actor, data.attr1, data.attr2, data.ability);
        return dices + data.getBonus(actor, dices);
    }

    static #calculateHalfDefensiveDices(actor, data) {
        const dices = ActorUtils.calculateDices(actor, data.attr1, data.attr2, data.ability);
        return Math.floor(dices / 2) + data.getBonus(actor, dices);
    }
}
