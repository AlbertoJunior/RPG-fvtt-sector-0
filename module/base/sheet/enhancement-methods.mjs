import { _createEmptyOption, _createOption } from "../../../scripts/creators/jscript/element-creator-jscript.mjs";
import { EnhancementRepository } from "../../../scripts/repository/enhancement-repository.mjs";
import { getObject, TODO } from "../../../scripts/utils/utils.mjs";
import { EnhancementLevelField } from "../../field/actor-enhancement-field.mjs";
import { ActorEnhancementField } from "../../field/actor-fields.mjs";
import { SheetMethods } from "./sheet-methods.mjs";

export function updateEnhancementLevelsOptions(enhancementId, selects) {
    const enhancementLevels = EnhancementRepository._getEnhancementLevelsByEnhancementId(enhancementId);
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

export function selectLevelOnOptions(enhance, selects) {
    const levels = enhance.levels;
    Array.from(selects).forEach((select, index) => {
        const level = levels[`nv${index + 1}`];
        if (level && level.id != '') {
            const option = Array.from(select.options).find(option => option.value == level.id);
            if (option) {
                option.selected = true;
            }
        }
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
    const dataset = currentTarget.dataset;

    const systemCharacteristic = SheetMethods.characteristicTypeMap[dataset.characteristic];
    if (!systemCharacteristic)
        return;

    const { enhancementSlot, enhancementLevel } = dataset;

    const enhancementOnSlot = getObject(actor, `${systemCharacteristic}_${enhancementSlot}`);
    const effectId = currentTarget.selectedOptions[0].value;

    const fetchedLevel = EnhancementRepository._getEnhancementLevelById(enhancementOnSlot.id, effectId);
    if (!fetchedLevel)
        return;

    const updatedCharacteristic = { ...enhancementOnSlot.levels };
    updatedCharacteristic[`nv${enhancementLevel}`] = new EnhancementLevelField(fetchedLevel.id, fetchedLevel.name, fetchedLevel.requirement);

    const characteristic = {
        [`${systemCharacteristic}_${enhancementSlot}.levels`]: updatedCharacteristic
    };

    await actor.update(characteristic);
}

export const enhancementHandleMethods = {
    change: async (actor, event) => {
        const currentTarget = event.currentTarget;
        const type = currentTarget.dataset.type;

        if (type == 'enhancement') {
            const selects = currentTarget.parentElement.querySelectorAll('ul select');
            updateEnhancementLevelsOptions(currentTarget.dataset.itemId, selects);
            await updateActorEnhancement(currentTarget, actor);
        } else if (type == 'level') {
            await updateActorLevelEnhancement(currentTarget, actor);
        }
    }
}