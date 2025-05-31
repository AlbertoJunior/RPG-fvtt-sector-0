import { getObject, localize } from "../../../../../scripts/utils/utils.mjs";
import { ActorEquipmentUtils } from "../../../../core/actor/actor-equipment.mjs";
import { ActorUtils } from "../../../../core/actor/actor-utils.mjs";
import { NpcConversor } from "../../../../core/npc/npc-conversor.mjs";
import { RollSimplified } from "../../../../core/rolls/simplified-roll.mjs";
import { CreateFormDialog } from "../../../../creators/dialog/create-dialog.mjs";
import { NotificationsUtils } from "../../../../creators/message/notifications.mjs";
import { CharacteristicType, NpcCharacteristicType } from "../../../../enums/characteristic-enums.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { NpcQualityRepository } from "../../../../repository/npc-quality-repository.mjs";
import { DefaultActions } from "../../../../utils/default-actions.mjs";

export const npcRollHandle = {
    [OnEventType.ROLL]: async (actor, event) => NpcRollMethods.handleRoll(actor, event),
    rollEquipment: async (actor, event) => NpcRollMethods.handleEquipmentRoll(actor, event),
    rollableItem: async (actor, rollTest, item, half) => NpcRollMethods.rollByEquipment(actor, { item, rollTest }, half),
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

        const rollInformations = { value, skillName };
        this.#openDialogModifiers(actor, rollInformations);
    }

    static async #openDialogModifiers(actor, rollInformations) {
        const qualityNpc = getObject(actor, NpcCharacteristicType.QUALITY);
        const qualityValues = NpcQualityRepository.getItem(qualityNpc)?.bonusOrDebuff || 0;

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

                    this.#mountRollInformations(copiedActor, rollInformations, data);
                }
            },
        );
    }

    static async #mountRollInformations(actor, rollInformations, data) {
        const { value, skillName, item } = rollInformations;

        const simplifiedRoll = await RollSimplified.roll(
            actor,
            {
                value,
                skillName,
                item,
                ...data,
            }
        );

        await DefaultActions.processSimplefiedRoll(actor, simplifiedRoll);
    }

    static async handleEquipmentRoll(actor, event) {
        const equipmentId = event.currentTarget.dataset.itemId;
        const rollEquipmentInformations = ActorEquipmentUtils.getItemAndRollTest(actor, equipmentId);
        await this.rollByEquipment(actor, rollEquipmentInformations);
    }

    static async rollByEquipment(actor, rollEquipmentInformations, half) {
        if (!rollEquipmentInformations) {
            NotificationsUtils._warning("É preciso definir um teste padrão para o item");
            return;
        }

        const ability = rollEquipmentInformations.rollTest.ability;
        const skills = Object.values(this.#skillMap);

        const matchedSkill = skills.find(skill => getObject(actor, skill.SKILL_NAME) === ability);
        if (!matchedSkill) {
            NotificationsUtils._warning("O teste desse item não utiliza nenhuma Habilidade conhecida pelo Personagem");
            return;
        }

        const skillName = getObject(actor, matchedSkill.SKILL_NAME);
        const value = getObject(actor, matchedSkill.VALUE);

        const informationsToRoll = {
            value: value,
            skillName: skillName,
            ...rollEquipmentInformations,
            isHalf: half,
        };

        const simplifiedRoll = await RollSimplified.rollByEquipment(actor, informationsToRoll);
        await DefaultActions.processSimplefiedRoll(actor, simplifiedRoll);
    }
}