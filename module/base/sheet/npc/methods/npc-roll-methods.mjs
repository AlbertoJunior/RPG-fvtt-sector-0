import { getObject, localize } from "../../../../../scripts/utils/utils.mjs";
import { ActorUtils } from "../../../../core/actor/actor-utils.mjs";
import { NpcConversor } from "../../../../core/npc/npc-conversor.mjs";
import { CoreRollMethods } from "../../../../core/rolls/core-roll-methods.mjs";
import { CreateFormDialog } from "../../../../creators/dialog/create-dialog.mjs";
import { CharacteristicType, NpcCharacteristicType } from "../../../../enums/characteristic-enums.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { AbilityRepository } from "../../../../repository/ability-repository.mjs";
import { NpcQualityRepository } from "../../../../repository/npc-quality-repository.mjs";
import { DefaultActions } from "../../../../utils/default-actions.mjs";

export const npcRollHandle = {
    [OnEventType.ROLL]: async (actor, event) => NpcRollMethods.handleRoll(actor, event),
}

class NpcRollMethods {
    static #skillMap = {
        [NpcCharacteristicType.SKILLS.PRIMARY.id]: NpcCharacteristicType.SKILLS.PRIMARY,
        [NpcCharacteristicType.SKILLS.SECONDARY.id]: NpcCharacteristicType.SKILLS.SECONDARY,
        [NpcCharacteristicType.SKILLS.TERTIARY.id]: NpcCharacteristicType.SKILLS.TERTIARY,
        [NpcCharacteristicType.SKILLS.QUATERNARY.id]: NpcCharacteristicType.SKILLS.QUATERNARY
    };

    static handleRoll(actor, event) {
        const rollSkill = event.currentTarget.dataset.subcharacteristic;

        const selectedSkill = this.#skillMap[rollSkill];
        if (!selectedSkill) {
            return;
        }

        const skillName = getObject(actor, selectedSkill.SKILL_NAME);
        const value = getObject(actor, selectedSkill.VALUE);
        if (value == 0 || skillName == undefined || skillName == '') {
            return;
        }

        this.#openDialogModifiers(actor, value, skillName);
    }

    static async #openDialogModifiers(actor, value, skillName) {
        const qualityNpc = getObject(actor, NpcCharacteristicType.QUALITY);
        const qualityValues = NpcQualityRepository._getItems().find(quality => quality.id == qualityNpc)?.bonusOrDebuff || 0;

        const canBeHalf = qualityValues >= 0;
        const canBeOverloaded = qualityValues >= 2;
        const canBeSpecialist = qualityValues > 2;

        CreateFormDialog._open(
            localize("Modificadores"),
            "rolls/modifiers",
            {
                presetForm: {
                    canBeHalf: canBeHalf,
                    canBeOverload: canBeOverloaded,
                    canBeSpecialist: canBeSpecialist,
                    canBePenalty: true,
                    values: {
                        overload: ActorUtils.getOverload(actor),
                        penalty: NpcConversor.calculatePenalty(actor),
                    }
                },
                onConfirm: async (data) => {
                    const copiedActor = {
                        ...actor,
                    };
                    copiedActor.system[CharacteristicType.OVERLOAD.id] = Number(data.overload);

                    this.#mountRollInformations(copiedActor, value, skillName, data);
                }
            },
        );
    }

    static async #mountRollInformations(actor, value, skillName, data) {
        const modifiersInformations = {
            specialist: Boolean(data.specialist == 'on'),
            bonus: Number(data.bonus),
            penalty: Number(data.penalty),
            isHalf: Boolean(data.half == 'on'),
            automatic: Number(data.automatic),
        };

        const abilityInfo = {
            skill: skillName,
            label: AbilityRepository._getItems().find(skill => skill.id == skillName).label
        }

        const halfDiceAmount = Math.floor(value / 2);
        const adjustedForHalf = modifiersInformations.isHalf ? halfDiceAmount : value;
        const finalValue = Math.max(adjustedForHalf + modifiersInformations.bonus - modifiersInformations.penalty, 0);

        const rolledDices = await CoreRollMethods.rollDiceAmountWithOverload(actor, finalValue);

        const rollInformation = {
            resultRoll: rolledDices,
            abilityInfo: abilityInfo,
            modifiers: modifiersInformations,
            difficulty: Number(data.difficulty),
            critic: Number(data.critic),
            mode: data.chatSelect,
        };

        DefaultActions.processSimplefiedRoll(actor, rollInformation);
    }
}