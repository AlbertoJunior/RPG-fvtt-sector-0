export const CharacteristicType = Object.freeze({
    ATTRIBUTE: { id: 'atributos', system: 'system.atributos' },
    VIRTUES: { id: 'virtudes', system: 'system.virtudes' },
    REPERTORY: { id: 'repertorio', system: 'system.repertorio' },
    ABILITY: { id: 'habilidades', system: 'system.habilidades' },
    LANGUAGE: { id: 'linguas', system: 'system.linguas' },
    TRAIT: { id: 'tracos', system: 'system.tracos' },
    SIMPLE: { id: '', system: 'system' },
});

export const OnClickEventType = Object.freeze({
    CHARACTERISTIC: { id: 'characteristic', event: 'characteristicOnClick' },
    ADD: { id: 'add', event: 'addOnClick' },
    REMOVE: { id: 'remove', event: 'removeOnClick' },
    EDIT: { id: 'edit', event: 'editOnClick' },
    VIEW: { id: 'view', event: 'viewOnClick' },
    CHAT: { id: 'chat', event: 'chatOnClick' },
});