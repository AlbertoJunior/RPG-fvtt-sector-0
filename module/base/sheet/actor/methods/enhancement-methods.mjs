import { ChatCreator } from "../../../../utils/chat-creator.mjs";
import { EnhancementDialog } from "../../../../creators/dialog/enhancement-dialog.mjs";
import { createOptionsAndSetOnSelects } from "../../../../creators/element/element-creator-jscript.mjs";
import { NotificationsUtils } from "../../../../creators/message/notifications.mjs";
import { getObject, localize } from "../../../../../scripts/utils/utils.mjs";
import { EnhancementUtils } from "../../../../core/enhancement/enhancement-utils.mjs";
import { getActorEnhancementSlot } from "../../../../enums/characteristic-enums.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { EnhancementDuration } from "../../../../enums/enhancement-enums.mjs";
import { ActorEnhancementField } from "../../../../field/actor-fields.mjs";
import { EnhancementRepository } from "../../../../repository/enhancement-repository.mjs";
import { ActorUpdater } from "../../../updater/actor-updater.mjs";
import { ActiveEffectsUtils } from "../../../../core/effect/active-effects.mjs";
import { activeEffectOriginTypeLabel, ActiveEffectsFlags, ActiveEffectsOriginTypes, ActiveEffectsTypes } from "../../../../enums/active-effects-enums.mjs";
import { ActorUtils } from "../../../../core/actor/actor-utils.mjs";
import { EnhancementMessageCreator } from "../../../../creators/message/enhancement-message.mjs";
import { ConfirmationDialog } from "../../../../creators/dialog/confirmation-dialog.mjs";

export function updateEnhancementLevelsOptions(enhancementId, selects) {
    const enhancementLevels = EnhancementRepository.getEnhancementEffectsByEnhancementId(enhancementId);
    createOptionsAndSetOnSelects(Array.from(selects), enhancementLevels);
}

export function selectLevelOnOptions(enhancement, selects, activeEffects) {
    const levels = enhancement.levels;
    Array.from(selects).forEach((select, index) => {
        const levelId = levels[`nv${index + 1}`]?.id;
        if (levelId != '') {
            const option = Array.from(select.options).find(option => option.value == levelId);
            if (option) {
                option.selected = true;

                const isActive = activeEffects.has(levelId);
                setupViewButtonIsVisibleAndItemIsChecked(select.parentElement, isActive);
            }
        }
    });
}

function setupViewButtonIsVisibleAndItemIsChecked(parent, isActive) {
    $(parent).find(`a[data-action=${OnEventType.VIEW}]`).toggleClass('hidden');
    $(parent).find(`a[data-action=${OnEventType.CHECK}]`)
        .toggleClass('hidden')
        .toggleClass('S0-selected', isActive);
}

async function updateActorEnhancement(currentTarget, actor) {
    const selectedEnhancement = currentTarget.selectedOptions[0];
    const enhancementId = selectedEnhancement.dataset.itemId;
    const enhancementText = selectedEnhancement.text;

    const enhancementOnSlotKey = getActorEnhancementSlot(currentTarget.dataset.itemId);
    const characteristic = ActorEnhancementField._toJson(enhancementId, enhancementText);

    if (enhancementId == undefined || enhancementId == '') {
        const enhancementOnSlot = getObject(actor, enhancementOnSlotKey);
        await removeEnhancementEffects(actor, enhancementOnSlot);
    }

    const enhancementsIds = ActorUtils.getAllEnhancements(actor).some(enh => enh.id === enhancementId);
    if (enhancementId !== '' && enhancementsIds) {
        NotificationsUtils._error(`O Personagem já possui esse Aprimoramento: <u>${enhancementText}</u>`);
        currentTarget.options[0].selected = true;
        currentTarget.blur();
        return;
    }
    ActorUpdater._verifyAndUpdateActor(actor, enhancementOnSlotKey, characteristic);
}

async function updateActorLevelEnhancement(currentTarget, actor) {
    const { enhancementSlot, enhancementLevel } = currentTarget.dataset;
    const effectId = currentTarget.selectedOptions[0].value;

    const enhancementOnSlotKey = getActorEnhancementSlot(enhancementSlot);
    const enhancementOnSlot = getObject(actor, `${enhancementOnSlotKey}`);

    const effect = EnhancementRepository.getEnhancementEffectById(effectId, enhancementOnSlot.id);

    if (effectId !== '') {
        const alreadyHasEffect = ActorUtils.getAllEnhancements(actor)
            .flatMap(enhacement => Object.values(enhacement.levels))
            .map(levelEnhancement => levelEnhancement.id)
            .some(levelEnhancementId => levelEnhancementId == effectId);

        if (alreadyHasEffect) {
            NotificationsUtils._error(`O Personagem já possui esse Efeito: <u>${effect.name}</u>`);
            currentTarget.options[0].selected = true;
            currentTarget.blur();
            return;
        }
    }

    const oldEffect = enhancementOnSlot.levels[`nv${enhancementLevel}`];
    if (oldEffect.id && oldEffect.id != '' && oldEffect.id != effectId) {
        await ActiveEffectsUtils.removeActorEffect(actor, oldEffect.id)
    }

    const updatedCharacteristicLevels = { ...enhancementOnSlot.levels };
    updatedCharacteristicLevels[`nv${enhancementLevel}`] = effect;

    await ActorUpdater._verifyAndUpdateActor(actor, `${enhancementOnSlotKey}.levels`, updatedCharacteristicLevels);

    if (effect?.duration == EnhancementDuration.PASSIVE) {
        toggleEnhancementEffectOnActor(effect, actor);
    }
}

function getEffectSelectedId(event) {
    const currentTarget = event.currentTarget;
    const select = $(currentTarget.parentElement).find('select')[0];
    return select.selectedOptions[0]?.value;
}

async function activateEffectSendOnChat(effect, actor) {
    const message = await EnhancementMessageCreator.mountContentActiveDeactive(effect, localize('Ativou'));
    await verifyIsGmAndDefineShowChat(message, actor);
}

async function usedEffectSendOnChat(effect, actor) {
    const message = await EnhancementMessageCreator.mountContentActiveDeactive(effect, localize('Usou'));
    await verifyIsGmAndDefineShowChat(message, actor);
}

async function deactivedEffectSendOnChat(effect, actor) {
    const message = await EnhancementMessageCreator.mountContentActiveDeactive(effect, localize('Desativou'));
    await verifyIsGmAndDefineShowChat(message, actor);
}

async function verifyIsGmAndDefineShowChat(message, actor) {
    if (game.user.isGM) {
        ConfirmationDialog.open({
            titleDialog: "Ocultar Ação?",
            message: localize("Pergunta.Ocultar_Acao"),
            onCancel: async () => {
                await ChatCreator._sendToChat(actor, message);
            },
            onConfirm: async () => {
                await ChatCreator._sendToChat(actor, message, CONST.DICE_ROLL_MODES.PRIVATE);
            }
        });
    } else {
        await ChatCreator._sendToChat(actor, message);
    }
}

async function toggleEnhancementEffectOnActor(effect, actor) {
    if (!effect) {
        NotificationsUtils._error(`Efeito inválido`);
        return;
    }

    if (!actor) {
        NotificationsUtils._error(`Ator inválido`);
        return;
    }

    const haveEffect = ActiveEffectsUtils.getActorEffect(actor, effect.id);
    if (haveEffect) {
        await ActiveEffectsUtils.removeActorEffect(actor, ActiveEffectsUtils.getOriginId(haveEffect));
        await deactivedEffectSendOnChat(effect, actor);
        return;
    }

    const enhancement = await EnhancementRepository.getEnhancementFamilyByEffectId(effect.id);
    if (!enhancement) {
        return;
    }

    if (effect.duration == EnhancementDuration.USE) {
        await NotificationsUtils._info(`${localize("Voce")} ${localize("Usou")} ${effect.name}`)
        await usedEffectSendOnChat(effect, actor);
        return;
    } else {
        const activeEffectData = ActiveEffectsUtils.createEffectData({
            name: effect.name,
            description: localize('Aprimoramento'),
            origin: `${localize('Aprimoramento')}: ${enhancement.name}`,
            statuses: [effect.id],
            flags: {
                [ActiveEffectsFlags.ORIGIN_ID]: effect.id,
                [ActiveEffectsFlags.ORIGIN_TYPE]: ActiveEffectsOriginTypes.ENHANCEMENT,
                [ActiveEffectsFlags.ORIGIN_TYPE_LABEL]: activeEffectOriginTypeLabel(ActiveEffectsOriginTypes.ENHANCEMENT),
                [ActiveEffectsFlags.TYPE]: ActiveEffectsTypes.BUFF,
                ...(effect.duration !== EnhancementDuration.PASSIVE && {
                    [ActiveEffectsFlags.COMBAT_ID]: game.combat?.id
                })
            }
        });

        EnhancementUtils.verifyAndSetEffectChanges(actor, activeEffectData, effect.effectChanges, enhancement);
        EnhancementUtils.configureActiveEffect(activeEffectData, effect, enhancement);
        await ActorUpdater.addEffects(actor, [activeEffectData]);
        await activateEffectSendOnChat(effect, actor);
    }
}

async function removeEnhancementEffects(actor, enhancement) {
    const levels = enhancement?.levels;
    if (!levels) {
        return;
    }

    const ids = Object.values(levels).map(item => item.id).filter(Boolean);
    await ActiveEffectsUtils.removeActorEffects(actor, ids);
}

async function removeAllEnhancementEffects(actor) {
    const effects = actor.effects
        .filter(effect => ActiveEffectsUtils.getOriginType(effect) == ActiveEffectsOriginTypes.ENHANCEMENT)
        .map(effect => ActiveEffectsUtils.getOriginId(effect))
        .filter(Boolean);
    await ActiveEffectsUtils.removeActorEffects(actor, effects);
}

async function activePassiveEffects(actor) {
    const passiveEffects = ActorUtils.getAllEnhancements(actor)
        .flatMap(e => Object.values(e.levels))
        .filter(ef => ef.id !== '' && ef.duration == EnhancementDuration.PASSIVE);

    await Promise.all(passiveEffects.map(effect => toggleEnhancementEffectOnActor(effect, actor)));
}

export const enhancementHandleMethods = {
    [OnEventType.REMOVE]: async (actor, event) => {
        await removeAllEnhancementEffects(actor);
        await activePassiveEffects(actor);
    },
    [OnEventType.CHANGE]: async (actor, event) => {
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
    [OnEventType.VIEW]: async (actor, event) => {
        const effectId = getEffectSelectedId(event);
        const effect = EnhancementRepository.getEnhancementEffectById(effectId);
        if (effect) {
            EnhancementDialog.open(effect, actor, () => toggleEnhancementEffectOnActor(effect, actor));
        } else {
            NotificationsUtils._warning('enhancement-methods:view:effect is null');
        }
    },
    [OnEventType.CHECK]: async (actor, event) => {
        const effectId = getEffectSelectedId(event);
        const effect = EnhancementRepository.getEnhancementEffectById(effectId);
        if (effect) {
            toggleEnhancementEffectOnActor(effect, actor);
        } else {
            NotificationsUtils._warning('enhancement-methods:check:effect is null');
        }
    },
}