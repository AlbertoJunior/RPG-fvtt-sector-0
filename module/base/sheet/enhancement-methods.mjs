import { ChatCreator } from "../../../scripts/creators/chat-creator.mjs";
import { EnhancementDialog } from "../../../scripts/creators/dialogs/enhancement-dialog.mjs";
import { _createEmptyOption, _createOption } from "../../../scripts/creators/jscript/element-creator-jscript.mjs";
import { EnhancementRepository } from "../../../scripts/repository/enhancement-repository.mjs";
import { NotificationsUtils } from "../../../scripts/utils/notifications.mjs";
import { getObject, localize, TODO } from "../../../scripts/utils/utils.mjs";
import { EnhancementDuration } from "../../enums/enhancement-enums.mjs";
import { ActorEnhancementField } from "../../field/actor-fields.mjs";
import { SheetMethods } from "./sheet-methods.mjs";

export function updateEnhancementLevelsOptions(enhancementId, selects) {
    const enhancementLevels = EnhancementRepository._getEnhancementEffectsByEnhancementId(enhancementId);
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

export function selectLevelOnOptions(enhancement, selects, activeEffects) {
    const levels = enhancement.levels;
    Array.from(selects).forEach((select, index) => {
        const level = levels[`nv${index + 1}`];
        if (level && level.id != '') {
            const option = Array.from(select.options).find(option => option.value == level.id);
            if (option) {
                option.selected = true;

                setupViewButtonIsVisibleAndItemIsChecked(select, level.id, activeEffects);
            }
        }
    });
}

function setupViewButtonIsVisibleAndItemIsChecked(select, levelId, activeEffects) {
    const parent = select.parentElement;
    $(parent).find('a[data-action=view]').toggleClass('hidden');
    $(parent).find('a[data-action=check]').toggleClass('selected', checkHasEffect(levelId, activeEffects));
}

function checkHasEffect(effectId, activeEffects) {
    return activeEffects.some(aEffect => aEffect == effectId);
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

    let effect;
    if (effectId && effectId !== '') {
        effect = EnhancementRepository._getEnhancementEffectById(effectId, enhancementOnSlot.id);
    }

    const updatedCharacteristic = { ...enhancementOnSlot.levels };
    updatedCharacteristic[`nv${enhancementLevel}`] = effect;

    const characteristic = {
        [`${systemCharacteristic}_${enhancementSlot}.levels`]: updatedCharacteristic
    };

    await actor.update(characteristic);
}

function getEffectSelectedId(event) {
    const currentTarget = event.currentTarget;
    const select = $(currentTarget.parentElement).find('select')[0];
    return select.selectedOptions[0]?.value;
}

export async function sendEffectToChat(effect, actor) {
    ChatCreator._sendToChat(actor, effect.name)
}

export async function toggleEnhancementEffectOnActor(effect, actor) {
    if (!effect) {
        NotificationsUtils._error(`Efeito inválido`);
        return;
    }

    if (!actor) {
        NotificationsUtils._error(`Ator inválido`);
        return;
    }

    const haveEffect = actor.effects.find(ef => ef.name == effect.name);
    if (haveEffect) {
        await haveEffect.delete();
        ChatCreator._sendToChat(actor, `${effect.name} Desativou`);
        return
    }

    const activeEffectData = {
        label: effect.name,
        description: localize('Aprimoramento'),
        tint: "#00fc22",
        statuses: [effect.id]
    };

    if (effect.effectChanges.length > 0) {
        activeEffectData.changes = effect.effectChanges.map(change => {
            return {
                key: `system.bonus.${change.key}`,
                mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                value: change.value
            }
        });
    }

    if (effect.duration == EnhancementDuration.SCENE) {
        const enhancement = await EnhancementRepository._getEnhancementFamilyByEffectId(effect.id);
        if (enhancement.id == '1')
            activeEffectData.img = "systems/setor0OSubmundo/icons/user-ninja.svg";
        else if (enhancement.id == '2')
            activeEffectData.img = "systems/setor0OSubmundo/icons/heart-half-full.svg";

        activeEffectData.duration = { rounds: 1, starTime: 0 }
    }

    await actor.createEmbeddedDocuments("ActiveEffect", [activeEffectData]);

    TODO('colocar a rolagem de sobrecarga');
    TODO('enviar o resultado no chat');
}

export const enhancementHandleMethods = {
    remove: async (actor, event) => {
        const effects = actor.effects;
        for (const effect of effects) {
            const effectDuration = effect.duration.type
            if (effectDuration !== 'none') {
                effect.delete();
            }
        }
    },
    change: async (actor, event) => {
        const currentTarget = event.currentTarget;
        const type = currentTarget.dataset.type;

        if (type == 'enhancement') {
            await updateActorEnhancement(currentTarget, actor);
        } else if (type == 'level') {
            await updateActorLevelEnhancement(currentTarget, actor);
        }
    },
    view: async (actor, event) => {
        const effectId = getEffectSelectedId(event);
        if (effectId && effectId !== "") {
            const effect = await EnhancementRepository._getEnhancementEffectById(effectId);
            EnhancementDialog._open(effect, actor);
        }
    },
    check: async (actor, event) => {
        const effectId = getEffectSelectedId(event);
        if (effectId && effectId !== "") {
            const effect = await EnhancementRepository._getEnhancementEffectById(effectId);
            toggleEnhancementEffectOnActor(effect, actor);
        }
    }
}