import { ActiveEffectsUtils } from "../../../../core/effect/active-effects.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { HtmlJsUtils } from "../../../../utils/html-js-utils.mjs";

export const effectsHandleEvents = {
    [OnEventType.CHECK]: async (actor, event) => EffectsHandleEvents.handleCheck(actor, event),
    [OnEventType.REMOVE]: async (actor, event) => EffectsHandleEvents.handleRemove(actor, event),
    [OnEventType.VIEW]: async (actor, event) => EffectsHandleEvents.handleView(actor, event),
}

class EffectsHandleEvents {
    static async handleCheck(actor, event) {
        const effects = actor.effects
            .filter(effect => effect.duration.type !== 'none')
            .map(effect => ActiveEffectsUtils.getOriginId(effect));

        ActiveEffectsUtils.removeActorEffects(actor, effects);
    }

    static handleRemove(actor, event) {
        const currentTarget = event.currentTarget;
        const removeType = currentTarget.dataset.type;
        if (removeType == 'single') {
            const index = currentTarget.dataset.itemIndex;
            const effect = Array.from(actor.effects.values())[index];
            ActiveEffectsUtils.removeActorEffect(actor, ActiveEffectsUtils.getOriginId(effect));
        } else if (removeType == 'all') {
            const effects = actor.effects.map(effect => ActiveEffectsUtils.getOriginId(effect));
            ActiveEffectsUtils.removeActorEffects(actor, effects);
        }
    }

    static async handleView(actor, event) {
        const minHeight = actor.sheet.defaultHeight;
        const container = event.currentTarget.parentElement.parentElement.querySelector('#effects-container');
        const resultExpand = HtmlJsUtils.expandOrContractElement(container, { minHeight: minHeight });
        HtmlJsUtils.flipClasses(event.currentTarget.children[0], 'fa-chevron-down', 'fa-chevron-up');

        actor.sheet.isExpandedEffects = resultExpand.isExpanded;
    }
}