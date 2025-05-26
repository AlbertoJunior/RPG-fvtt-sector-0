export const EquipmentCharacteristicType = Object.freeze({
    NAME: { id: 'name', system: `system.name` },
    ID: { id: 'id', system: `system.id` },
    DESCRIPTION: { id: 'description', system: `system.description` },
    TYPE: { id: 'type', system: `system.type` },
    EQUIPPED: { id: 'equipped', system: `system.equipped` },
    QUANTITY: { id: 'quantity', system: `system.quantity` },
    RESISTANCE: { id: 'resistance', system: `system.resistance` },
    ACTUAL_RESISTANCE: { id: 'actual_resistance', system: `system.actual_resistance` },
    EFFECTS: { id: 'effects', system: `system.effects` },
    ACCELERATION: { id: 'acceleration', system: `system.acceleration` },
    SPEED: { id: 'speed', system: `system.speed` },
    HAND: { id: 'hand', system: `system.hand` },
    OCCULTABILITY: { id: 'occultability', system: `system.occultability` },
    DAMAGE: { id: 'damage', system: `system.damage` },
    TRUE_DAMAGE: { id: 'true_damage', system: `system.true_damage` },
    DAMAGE_TYPE: { id: 'damage_type', system: `system.damage_type` },
    CAPACITY: { id: 'capacity', system: `system.capacity` },
    CADENCE: { id: 'cadence', system: `system.cadence` },
    SHORT_RANGE: { id: 'short_range', system: `system.short_range` },
    MEDIUM_RANGE: { id: 'medium_range', system: `system.medium_range` },
    LONG_RANGE: { id: 'long_range', system: `system.long_range` },
    SPECIAL: { id: 'special', system: `system.special` },
    POSSIBLE_TESTS: { id: 'possible_tests', system: `system.possible_tests` },
    DEFAULT_TEST: { id: 'default_test', system: `system.default_test` },
    SUPER_EQUIPMENT: {
        id: 'super_equipment',
        system: `system.super_equipment`,
        LEVEL: { id: 'level', system: `system.super_equipment.level` },
        EFFECTS: { id: 'effects', system: `system.super_equipment.effects` },
        DEFECTS: { id: 'defects', system: `system.super_equipment.defects` },
    }
});

export const EquipmentType = Object.freeze({
    UNKNOWM: 0,
    ARMOR: 1,
    MELEE: 2,
    PROJECTILE: 3,
    VEHICLE: 4,
    SUBSTANCE: 5,
    ACESSORY: 6,
});

export function equipmentTypeIdToTypeString(type) {
    switch (type) {
        case EquipmentType.MELEE: return 'Melee'
        case EquipmentType.PROJECTILE: return 'Projectile'
        case EquipmentType.ARMOR: return 'Armor'
        case EquipmentType.VEHICLE: return 'Vehicle'
        case EquipmentType.SUBSTANCE: return 'Substance'
        case EquipmentType.ACESSORY: return 'Acessory'
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

export const DamageType = Object.freeze({
    SUPERFICIAL: 0,
    LETAL: 1,
    ELETRIC: 2,
    FIRE: 3,
    ICE: 4,
});

export const VehicleType = Object.freeze({
    JUNKER: 0,
    ECONOMY: 1,
    UTILITARY: 2,
    SPORT: 3,
    SUPER_SPORT: 4,
    RAW: 5,
    EXOTIC: 6,
});