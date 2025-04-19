import { ChatCreator } from "../../../../utils/chat-creator.mjs";
import { TraitDialog } from "../../../../creators/dialog/trait-dialog.mjs";
import { TraitRepository } from "../../../../repository/trait-repository.mjs";
import { ActorTraitField } from "../../../../field/actor-trait-field.mjs";
import { CharacteristicType } from "../../../../enums/characteristic-enums.mjs";
import { TODO } from "../../../../../scripts/utils/utils.mjs";
import { SheetMethods } from "./sheet-methods.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { TraitMessageCreator } from "../../../../creators/message/trait-message.mjs";

function getSystemChar(type) {
    return type == 'good' ? 'bons' : 'ruins';
}

function getSystemTraitCharacteristic(systemChar) {
    const systemCharacteristic = SheetMethods.characteristicTypeMap[CharacteristicType.TRAIT.id];
    if (!systemCharacteristic) {
        return null;
    }
    return `${systemCharacteristic}.${systemChar}`;
}

async function updateTraits(actor, systemChar, updatedTraits) {
    const sytemTraitCharacteristic = getSystemTraitCharacteristic(systemChar);
    if (!sytemTraitCharacteristic)
        return;

    const characteristic = { [sytemTraitCharacteristic]: updatedTraits };
    await actor.update(characteristic);
}

export const traitMethods = {
    [OnEventType.ADD]: async (actor, event) => {
        const traitType = event.currentTarget.dataset.type;
        const systemChar = getSystemChar(traitType);

        TraitDialog._open(traitType, async (trait) => {
            const objectTrait = ActorTraitField._toJson(trait.id, trait.name, trait.particularity);
            const updatedTraits = [...actor.system.tracos[systemChar], objectTrait];
            await updateTraits(actor, systemChar, updatedTraits);
        });
    },
    [OnEventType.EDIT]: async (actor, event) => {
        const target = event.currentTarget;
        const itemIndex = target.parentElement.dataset.itemIndex;
        if (itemIndex == undefined || itemIndex < 0)
            return;

        const type = target.dataset.type;
        const systemChar = getSystemChar(type);
        const trait = actor.system.tracos[systemChar][itemIndex];

        TraitDialog._openByTrait(trait, type, actor, async (editedTrait) => {
            const objectTrait = ActorTraitField._toJson(editedTrait.id, editedTrait.name, editedTrait.particularity);
            const updatedTraits = [...actor.system.tracos[systemChar]];
            updatedTraits[itemIndex] = objectTrait;
            await updateTraits(actor, systemChar, updatedTraits);
        });
    },
    [OnEventType.REMOVE]: async (actor, event) => {
        const target = event.currentTarget;
        const itemIndex = target.parentElement.dataset.itemIndex;
        if (itemIndex == undefined || itemIndex < 0)
            return;

        const type = target.dataset.type;
        const systemChar = getSystemChar(type);
        const updatedTraits = [...actor.system.tracos[systemChar]];
        updatedTraits.splice(itemIndex, 1);
        await updateTraits(actor, systemChar, updatedTraits);
    },
    [OnEventType.CHAT]: async (actor, event) => {
        const target = event.currentTarget;
        const itemIndex = target.parentElement.dataset.itemIndex;
        if (itemIndex == undefined || itemIndex < 0) {
            return;
        }

        const type = target.dataset.type;
        const systemChar = getSystemChar(type);
        const trait = actor.system.tracos[systemChar][itemIndex];
        const fetchedTrait = TraitRepository._getItemByTypeAndId(type, trait.id);
        const messageContent = await TraitMessageCreator.mountContent(fetchedTrait);
        ChatCreator._sendToChat(actor, messageContent);
    },
    [OnEventType.VIEW]: async (actor, event) => {
        const target = event.currentTarget;
        const type = target.dataset.type;
        const itemIndex = target.parentElement.dataset.itemIndex;
        if (itemIndex == undefined || itemIndex < 0) return;

        const systemChar = getSystemChar(type);
        const trait = actor.system.tracos[systemChar][itemIndex];
        TraitDialog._openByTrait(trait, type, actor, undefined);
    }
}