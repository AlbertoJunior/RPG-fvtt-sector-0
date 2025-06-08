import { getObject } from "../../../scripts/utils/utils.mjs";
import { BaseActorCharacteristicType, CharacteristicType, NpcCharacteristicType } from "../../enums/characteristic-enums.mjs";
import { NpcQualityRepository } from "../../repository/npc-quality-repository.mjs";
import { ActorUtils } from "../actor/actor-utils.mjs";

export class NpcUtils {
    static getStamina(actor) {
        const vitality = getObject(actor, BaseActorCharacteristicType.VITALITY.TOTAL) || 0;
        return Math.max(vitality - 5, 0);
    }

    static calculatePenalty(actor) {
        return Math.max(ActorUtils.calculatePenalty(actor) - this.getStamina(actor), 0)
    }

    static calculateInitiative(actor) {
        const quality = getObject(actor, NpcCharacteristicType.QUALITY);
        const types = NpcQualityRepository.TYPES;
        const mapped = {
            [types.WORST.id]: 0,
            [types.BAD.id]: 0,
            [types.NORMAL.id]: 1,
            [types.GOOD.id]: 2,
            [types.EXCEPTIONAL.id]: 3,
        };
        const qualityModifier = mapped[quality] || 0;

        const bonusInitiative = getObject(actor, CharacteristicType.BONUS.INITIATIVE) || 0;

        return Math.max(qualityModifier + bonusInitiative, 0);
    }
}