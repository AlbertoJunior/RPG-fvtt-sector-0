export const CharacteristicType = Object.freeze({
    ATTRIBUTE: { id: 'atributos', system: 'system.atributos' },
    VIRTUES: { id: 'virtudes', system: 'system.virtudes' },
    CONSCIOUSNESS_LEVEL: { id: 'consciencia_usada', system: 'system.virtudes.consciencia.level' },
    CONSCIOUSNESS_USED: { id: 'consciencia_usada', system: 'system.virtudes.consciencia.used' },
    PERSEVERANCE_LEVEL: { id: 'perseveranca_usada', system: 'system.virtudes.perseveranca.level' },
    PERSEVERANCE_USED: { id: 'perseveranca_usada', system: 'system.virtudes.perseveranca.used' },
    QUIETNESS_LEVEL: { id: 'quietude_usada', system: 'system.virtudes.quietude.level' },
    QUIETNESS_USED: { id: 'quietude_usada', system: 'system.virtudes.quietude.used' },
    REPERTORY: { id: 'repertorio', system: 'system.repertorio' },
    ABILITY: { id: 'habilidades', system: 'system.habilidades' },
    LANGUAGE: { id: 'linguas', system: 'system.linguas' },
    TRAIT: { id: 'tracos', system: 'system.tracos' },
    ENHANCEMENT: { id: 'enhancement', system: 'system.aprimoramentos.aprimoramento' },
    TEMPORARY: { id: 'temporary', system: 'system' },
    CORE: { id: 'core', system: 'system.nucleo' },
    OVERLOAD: { id: 'overload', system: 'system.sobrecarga' },
    LIFE: { id: 'vida', system: 'system.vida' },
    VITALITY_TOTAL: { id: 'vitalidade', system: 'system.vitalidade.total' },
    SUPERFICIAL_DAMAGE: { id: 'dano_superficial', system: 'system.vitalidade.dano_superficial' },
    LETAL_DAMAGE: { id: 'dano_letal', system: 'system.vitalidade.dano_letal' },
    SIMPLE: { id: '', system: 'system' },
});

export const CharacteristicTypeMap = Object.fromEntries(
    Object.entries(CharacteristicType).map(([key, value]) => [value.id, value.system])
);

export function characteristicTypeVirtueByType(type, isUsed) {
    switch (type) {
        case 'consciencia' : return isUsed ? CharacteristicType.CONSCIOUSNESS_USED.system : CharacteristicType.CONSCIOUSNESS_LEVEL.system;
        case 'perseveranca' : return isUsed ? CharacteristicType.PERSEVERANCE_USED.system : CharacteristicType.PERSEVERANCE_LEVEL.system;
        case 'quietude' : return isUsed ? CharacteristicType.QUIETNESS_USED.system : CharacteristicType.QUIETNESS_LEVEL.system;
    }
    return '';
}

export const OnEventType = Object.freeze({
    CHARACTERISTIC: { id: 'characteristic' },
    ADD: { id: 'add' },
    REMOVE: { id: 'remove' },
    EDIT: { id: 'edit' },
    VIEW: { id: 'view' },
    CHAT: { id: 'chat' },
    CHANGE: { id: 'change' },
    CHECK: { id: 'check' },
    ROLL: { id: 'roll' },
});