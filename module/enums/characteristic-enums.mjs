export const CharacteristicType = Object.freeze({
    ATTRIBUTE: { id: 'atributos', system: 'system.atributos' },
    VIRTUES: { id: 'virtudes', system: 'system.virtudes' },
    REPERTORY: { id: 'repertorio', system: 'system.repertorio' },
    ABILITY: { id: 'habilidades', system: 'system.habilidades' },
    LANGUAGE: { id: 'linguas', system: 'system.linguas' },
    TRAIT: { id: 'tracos', system: 'system.tracos' },
    ENHANCEMENT: { id: 'enhancement', system: 'system.aprimoramentos.aprimoramento' },
    TEMPORARY: { id: 'temporary', system: 'system' },
    OVERLOAD: { id: 'overload', system: 'system.sobrecarga' },
    SIMPLE: { id: '', system: 'system' },
});

export const CharacteristicTypeMap = Object.fromEntries(
    Object.entries(CharacteristicType).map(([key, value]) => [value.id, value.system])
);

export const OnEventType = Object.freeze({
    CHARACTERISTIC: { id: 'characteristic' },
    ADD: { id: 'add' },
    REMOVE: { id: 'remove' },
    EDIT: { id: 'edit' },
    VIEW: { id: 'view' },
    CHAT: { id: 'chat' },
    CHANGE: { id: 'change' },
    CHECK: { id: 'check' },
});