import { ChatCreator } from "../../../scripts/creators/chat-creator.mjs";
import { TraitDialog } from "../../../scripts/creators/dialogs/trait-dialog.mjs";
import { TraitRepository } from "../../../scripts/repository/trait-repository.mjs";
import { ActorTraitField } from "../../field/actor-trait-field.mjs";
import { CharacteristicType } from "../../enums/characteristic-enums.mjs";
import { TODO } from "../../../scripts/utils/utils.mjs";
import { SheetMethods } from "./sheet-methods.mjs";

function getSystemChar(type) {
    return type == 'good' ? 'bons' : 'ruins';
}

function getSystemTraitCharacteristic(systemChar) {
    const systemCharacteristic = SheetMethods.characteristicTypeMap[CharacteristicType.TRAIT.id];
    if (!systemCharacteristic)
        return null;
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
    async add(actor, event) {
        const traitType = event.currentTarget.dataset.type;
        const systemChar = getSystemChar(traitType);

        TraitDialog._open(traitType, async (trait) => {
            const objectTrait = new ActorTraitField(trait.id, trait.name, trait.particularity);
            const updatedTraits = [...actor.system.tracos[systemChar], objectTrait];
            await updateTraits(actor, systemChar, updatedTraits);
        });
    },

    async edit(actor, event) {
        const target = event.currentTarget;
        const itemIndex = target.parentElement.dataset.itemIndex;
        if (itemIndex == undefined || itemIndex < 0)
            return;

        const type = target.dataset.type;
        const systemChar = getSystemChar(type);
        const trait = actor.system.tracos[systemChar][itemIndex];

        TraitDialog._openByTrait(trait, type, actor, async (editedTrait) => {
            const objectTrait = new ActorTraitField(editedTrait.id, editedTrait.name, editedTrait.particularity);
            const updatedTraits = [...actor.system.tracos[systemChar]];
            updatedTraits[itemIndex] = objectTrait;
            await updateTraits(actor, systemChar, updatedTraits);
        });
    },

    async remove(actor, event) {
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

    async chat(actor, event) {
        const target = event.currentTarget;
        const itemIndex = target.parentElement.dataset.itemIndex;
        if (itemIndex == undefined || itemIndex < 0)
            return;

        const type = target.dataset.type;
        const systemChar = getSystemChar(type);
        const trait = actor.system.tracos[systemChar][itemIndex];
        const fetchedTrait = TraitRepository._getItemByTypeAndId(type, trait.id);
        const content = fetchedTrait.description;

        TODO("implementar lógica do content");
        ChatCreator._sendToChat(actor, content);
    },

    async view(actor, event) {
        const target = event.currentTarget;
        const type = target.dataset.type;
        const itemIndex = target.parentElement.dataset.itemIndex;
        if (itemIndex == undefined || itemIndex < 0) return;

        const systemChar = getSystemChar(type);
        const trait = actor.system.tracos[systemChar][itemIndex];
        TraitDialog._openByTrait(trait, type, actor, undefined);
    }
}