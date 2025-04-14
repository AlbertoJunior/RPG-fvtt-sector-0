export const EquipmentType = Object.freeze({
    UNKNOWM: 0,
    ARMOR: 1,
    MELEE: 2,
    PROJECTILE: 3,
    VEHICLE: 4,
    SUBSTANCE: 5,
});

export function equipmentTypeIdToTypeString(type) {
    switch (type) {
        case EquipmentType.MELEE: return 'Melee'
        case EquipmentType.PROJECTILE: return 'Projectile'
        case EquipmentType.ARMOR: return 'Armor'
        case EquipmentType.VEHICLE: return 'Vehicle'
        case EquipmentType.SUBSTANCE: return 'Substance'
    }
    return undefined;
}

export function validEquipmentTypes() {
    return Object.values(EquipmentType).filter(typeId => typeId !== EquipmentType.UNKNOWM);
}

export const EquipmentHidding = Object.freeze({
    POCKET: 0,
    JACKET: 1,
    NONE: 2,
});

export const EquipmentHand = Object.freeze({
    ONE_HAND: 0,
    ONE_HALF_HAND: 1,
    TWO_HANDS: 2,
});