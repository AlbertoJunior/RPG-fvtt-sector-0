export const OnEventType = Object.freeze({
    CHARACTERISTIC: 'characteristic',
    ADD: 'add',
    REMOVE: 'remove',
    EDIT: 'edit',
    VIEW: 'view',
    CHAT: 'chat',
    CHANGE: 'change',
    CONTEXTUAL: 'contextual',
    CHECK: 'check',
    ROLL: 'roll',
});

export const OnEventTypeClickableEvents = Object.values(OnEventType)
    .filter(event => event !== OnEventType.CHANGE && event !== OnEventType.CHARACTERISTIC && event !== OnEventType.CONTEXTUAL);