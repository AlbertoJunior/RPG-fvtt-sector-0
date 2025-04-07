import { ChatCreator } from "../../../scripts/creators/chat-creator.mjs";
import { EnhancementDialog } from "../../../scripts/creators/dialogs/enhancement-dialog.mjs";
import { _createEmptyOption, _createOption } from "../../../scripts/creators/jscript/element-creator-jscript.mjs";
import { EnhancementRepository } from "../../../scripts/repository/enhancement-repository.mjs";
import { ActorUtils } from "../../../scripts/utils/actor.mjs";
import { NotificationsUtils } from "../../../scripts/utils/notifications.mjs";
import { getObject, localize, TODO } from "../../../scripts/utils/utils.mjs";
import { CharacteristicType, OnEventType } from "../../enums/characteristic-enums.mjs";
import { EffectChangeValueType, EnhancementDuration } from "../../enums/enhancement-enums.mjs";
import { ActorEnhancementField } from "../../field/actor-fields.mjs";
import { ActorUpdater } from "../updater/actor-updater.mjs";

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
    $(parent).find(`a[data-action=${OnEventType.VIEW.id}]`).toggleClass('hidden');
    $(parent).find(`a[data-action=${OnEventType.CHECK.id}]`).toggleClass('S0-selected', checkHasEffect(levelId, activeEffects));
}

function checkHasEffect(effectId, activeEffects) {
    return activeEffects.some(aEffect => aEffect == effectId);
}

async function updateActorEnhancement(currentTarget, actor) {
    const selectedEnhancement = currentTarget.selectedOptions[0];
    const enhancementId = selectedEnhancement.dataset.itemId;
    const enhancementText = selectedEnhancement.text;

    const slotEnhancement = currentTarget.dataset.itemId;
    const key = `${CharacteristicType.ENHANCEMENT.system}_${slotEnhancement}`;
    const characteristic = ActorEnhancementField._toJson(enhancementId, enhancementText);

    if (enhancementId == undefined || enhancementId == '') {
        const enhancementOnSlot = getObject(actor, key);
        await removeEnhancementEffects(actor, enhancementOnSlot);
    }

    ActorUpdater._verifyAndUpdateActor(actor, key, characteristic);
}

async function updateActorLevelEnhancement(currentTarget, actor) {
    const { enhancementSlot, enhancementLevel } = currentTarget.dataset;
    const effectId = currentTarget.selectedOptions[0].value;

    const enhancementOnSlotKey = `${CharacteristicType.ENHANCEMENT.system}_${enhancementSlot}`

    const enhancementOnSlot = getObject(actor, `${enhancementOnSlotKey}`);

    const effect = EnhancementRepository._getEnhancementEffectById(effectId, enhancementOnSlot.id);

    const oldEffect = enhancementOnSlot.levels[`nv${enhancementLevel}`];
    if (!effect || oldEffect.id != effect.id) {
        await removeEffect(actor, oldEffect.id);
    }

    const updatedCharacteristicLevels = { ...enhancementOnSlot.levels };
    updatedCharacteristicLevels[`nv${enhancementLevel}`] = effect;

    await ActorUpdater._verifyAndUpdateActor(actor, `${enhancementOnSlotKey}.levels`, updatedCharacteristicLevels);

    if (effect && effect.duration == EnhancementDuration.PASSIVE) {
        toggleEnhancementEffectOnActor(effect, actor);
    }
}

function getEffectSelectedId(event) {
    const currentTarget = event.currentTarget;
    const select = $(currentTarget.parentElement).find('select')[0];
    return select.selectedOptions[0]?.value;
}

export async function sendEffectToChat(effect, actor) {
    TODO('criar o envio para o chat');
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
        ChatCreator._sendToChat(actor, `Desativou ${effect.name}`);
        return;
    }

    const enhancement = await EnhancementRepository._getEnhancementFamilyByEffectId(effect.id);

    const activeEffectData = {
        label: effect.name,
        description: localize('Aprimoramento'),
        origin: `${localize('Aprimoramento')}: ${enhancement.name}`,
        statuses: [effect.id]
    };

    if (effect.effectChanges.length > 0) {
        const enhancementLevel = ActorUtils.getEnhancementLevel(actor, enhancement);

        activeEffectData.changes = effect.effectChanges.map(change => {
            let value = 0;
            
            const typeOfValue = change.typeOfValue;
            if (typeOfValue == EffectChangeValueType.FIXED) {
                value = change.value;
            } else if (typeOfValue == EffectChangeValueType.ENHANCEMENT_LEVEL) {
                value = enhancementLevel;
            } else if (typeOfValue == EffectChangeValueType.HALF_ENHANCEMENT_LEVEL) {
                value = Math.floor(enhancementLevel / 2);
            } else if (typeOfValue == EffectChangeValueType.ENHANCEMENT_LEVEL_PLUS_FIXED) {
                value = enhancementLevel + change.value;
            } else if (typeOfValue == EffectChangeValueType.HALF_ENHANCEMENT_LEVEL_PLUS_FIXED) {
                value = Math.floor(enhancementLevel / 2) + change.value;
            }

            return {
                key: `system.${change.key}`,
                mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                value: value
            }
        });
    }

    if (effect.duration == EnhancementDuration.SCENE) {
        TODO('colocar os ícones corretos');

        if (enhancement.id == '1')
            activeEffectData.img = "systems/setor0OSubmundo/icons/user-ninja.svg";
        else if (enhancement.id == '2')
            activeEffectData.img = "systems/setor0OSubmundo/icons/heart-half-full.svg";

        activeEffectData.tint = "#00fc22";
        activeEffectData.duration = { rounds: 99, startTime: 0 };
    } else if (effect.duration == EnhancementDuration.USE) {
        activeEffectData.duration = { rounds: 1, turns: 1, startTime: 0 };
    }

    TODO('colocar a rolagem de sobrecarga');

    await actor.createEmbeddedDocuments("ActiveEffect", [activeEffectData]);

    TODO('enviar o resultado no chat');
}

async function removeEffect(actor, oldEffectId) {
    const effects = actor.effects;
    for (const effect of effects) {
        const effectId = effect.statuses.first();
        if (oldEffectId == effectId) {
            await effect.delete();
            return;
        }
    }
}

async function removeEnhancementEffects(actor, enhancement) {
    const effects = actor.effects;
    const levels = enhancement?.levels || {};
    const ids = new Set(Object.values(levels).map(item => item.id).filter(id => id !== ""));

    for (const effect of effects) {
        const effectId = effect.statuses.first();
        if (ids.has(effectId)) {
            await effect.delete();
        }
    }
}

async function removeNonePassivesEffects(actor) {
    const effects = actor.effects;
    for (const effect of effects) {
        const effectDuration = effect.duration.type
        if (effectDuration !== 'none') {
            effect.delete();
        }
    }
}

export const enhancementHandleMethods = {
    remove: async (actor, event) => {
        removeNonePassivesEffects(actor);
    },
    change: async (actor, event) => {
        const currentTarget = event.currentTarget;
        const type = currentTarget.dataset.type;

        if (type == 'enhancement') {
            updateActorEnhancement(currentTarget, actor);
        } else if (type == 'level') {
            updateActorLevelEnhancement(currentTarget, actor);
        } else {
            NotificationsUtils._warning(`enhancement-methods:change:type [${type}] is not mapped`);
        }
    },
    view: async (actor, event) => {
        const effectId = getEffectSelectedId(event);
        const effect = EnhancementRepository._getEnhancementEffectById(effectId);
        if (effect) {
            EnhancementDialog._open(effect, actor);
        } else {
            NotificationsUtils._warning('enhancement-methods:view:effect is null');
        }
    },
    check: async (actor, event) => {
        const effectId = getEffectSelectedId(event);
        const effect = EnhancementRepository._getEnhancementEffectById(effectId);
        if (effect) {
            toggleEnhancementEffectOnActor(effect, actor);
        } else {
            NotificationsUtils._warning('enhancement-methods:check:effect is null');
        }
    }
}