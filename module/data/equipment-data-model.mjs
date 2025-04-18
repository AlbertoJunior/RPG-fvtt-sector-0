import { DamageType, EquipmentHand, EquipmentHidding, EquipmentType, equipmentTypeIdToTypeString } from "../enums/equipment-enums.mjs";
import { RollTestDataModel } from "./roll-test-data-model.mjs";

const { StringField, NumberField, BooleanField, ArrayField } = foundry.data.fields;

class EquipmentDataModel extends foundry.abstract.TypeDataModel {
    get isEquipment() {
        return true;
    }

    get canEquip() {
        return true;
    }

    get canRoll() {
        return false;
    }

    get haveQuantity() {
        return this.quantity !== undefined;
    }

    get isWeapon() {
        return false;
    }

    setupValues(data) {
        this.name = data.name;
        this.img = data.img;
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }

    static defineSchema() {
        return {
            name: new StringField({ required: true, label: "S0.Nome" }),
            description: new StringField({ required: true, label: "S0.Descricao" }),
            resistance: new NumberField({ integer: true, initial: 1, label: "S0.Resistencia" }),
        };
    }
}

class ArmorDataModel extends EquipmentDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.ARMOR, label: "S0.Tipo" }),
        };
    }
}

class SubstanceDataModel extends EquipmentDataModel {
    get canEquip() {
        return false;
    }

    get canUse() {
        return this.quantity > 0;
    }

    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.SUBSTANCE, label: "S0.Tipo" }),
            quantity: new NumberField({ integer: true, initial: 1, minValue: 0, label: "S0.Quantidade" }),
            effects: new ArrayField(new StringField())
        };
    }
}

class RollableDataModel extends EquipmentDataModel {
    get canRoll() {
        return true;
    }

    static defineSchema() {
        return {
            ...super.defineSchema(),
            default_test: new StringField({ required: false, blank: true }),
            possible_tests: new ArrayField(new RollTestDataModel()),
        };
    }
}

class VehicleDataModel extends RollableDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.VEHICLE, label: "S0.Tipo" }),
            acceleration: new NumberField({ integer: true, initial: 0 }),
            speed: new NumberField({ integer: true, initial: 0 })
        };
    }
}

class WeaponDataModel extends RollableDataModel {
    get canRoll() {
        return true;
    }

    get isWeapon() {
        return true;
    }

    static defineSchema() {
        return {
            ...super.defineSchema(),
            hand: new NumberField({ integer: true, initial: EquipmentHand.ONE_HAND }),
            damage: new NumberField({ integer: true, initial: 0 }),
            true_damage: new NumberField({ integer: true, initial: 0 }),
            damage_type: new NumberField({ integer: true, initial: DamageType.LETAL }),
            occultability: new NumberField({ integer: true, initial: EquipmentHidding.POCKET })
        };
    }
}

class MeleeDataModel extends WeaponDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.MELEE, label: "S0.Tipo" }),
        };
    }
}

class ProjectileDataModel extends WeaponDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.PROJECTILE, label: "S0.Tipo" }),
            capacity: new NumberField({ integer: true, initial: 1 }),
            cadence: new NumberField({ integer: true, initial: 1 }),
            short_range: new NumberField({ integer: true, initial: 1 }),
            medium_range: new NumberField({ integer: true, initial: 1 }),
            long_range: new NumberField({ integer: true, initial: 1 }),
            special: new BooleanField({ initial: false })
        };
    }
}

const EquipmentTypeStringMap = {
    [equipmentTypeIdToTypeString(EquipmentType.MELEE)]: MeleeDataModel,
    [equipmentTypeIdToTypeString(EquipmentType.PROJECTILE)]: ProjectileDataModel,
    [equipmentTypeIdToTypeString(EquipmentType.ARMOR)]: ArmorDataModel,
    [equipmentTypeIdToTypeString(EquipmentType.VEHICLE)]: VehicleDataModel,
    [equipmentTypeIdToTypeString(EquipmentType.SUBSTANCE)]: SubstanceDataModel
};

export function equipmentParseData(data) {
    const ModelClass = EquipmentTypeStringMap[data.type] ?? EquipmentDataModel;
    const dataObject = data.toObject();
    const model = new ModelClass(dataObject.system);
    model.setupValues(data);
    return model;
}

export async function createEquipmentDataModels() {
    CONFIG.Item.dataModels = {
        Melee: MeleeDataModel,
        Projectile: ProjectileDataModel,
        Armor: ArmorDataModel,
        Vehicle: VehicleDataModel,
        Substance: SubstanceDataModel,
    };
}