import { _createEmptyOption, _createOption } from "../../../scripts/creators/jscript/element-creator-jscript.mjs";
import { EnhancementRepository } from "../../../scripts/repository/enhancement-repository.mjs";
import { TODO } from "../../../scripts/utils/utils.mjs";
import { ActorEnhancementField } from "../../field/actor-fields.mjs";
import { SheetMethods } from "./sheet-methods.mjs";

export async function updateEnhancementLevelsOptions(enhancementId, selects) {
    const enhancementLevels = await EnhancementRepository._getEnhancementLevelsByEnhancementIdWithPacks(enhancementId);
    createOptionsAndSetOnSelects(Array.from(selects), enhancementLevels);
}

function createOptionsAndSetOnSelects(selects = [], options = []) {
    selects.forEach(select => {
        select.innerHTML = '';

        select.appendChild(_createEmptyOption());

        options.forEach(optionElement => {
            const option = _createOption(optionElement.id, optionElement.name);
            select.appendChild(option);
        });
    });
}

async function updateActorEnhancement(currentTarget, actor) {
    const characteristicType = currentTarget.dataset.characteristic;
    const systemCharacteristic = SheetMethods.characteristicTypeMap[characteristicType];

    if (!systemCharacteristic)
        return;

    const slotEnhancement = currentTarget.dataset.itemId;

    const selectedEnhancement = currentTarget.options[currentTarget.options.selectedIndex];
    const enhancementId = selectedEnhancement.dataset.itemId;
    const enhancementText = selectedEnhancement.text;

    const characteristic = {
        [`${systemCharacteristic}_${slotEnhancement}`]: new ActorEnhancementField(enhancementId, enhancementText)
    };

    await actor.update(characteristic);
}

async function updateActorLevelEnhancement(currentTarget, actor) {
    TODO('fazer o update do level do enhancement')
}

export const enhancementHandleMethods = {
    change: async (actor, event) => {
        const currentTarget = event.currentTarget;
        const type = currentTarget.dataset.type;

        if (type == 'enhancement') {
            const selects = currentTarget.parentElement.querySelectorAll('ul select');
            await updateEnhancementLevelsOptions(currentTarget.dataset.itemId, selects);
            await updateActorEnhancement(currentTarget, actor);
        } else if (type == 'level') {
            await updateActorLevelEnhancement(currentTarget, actor);
        }
    }
}