import { TODO } from "../../scripts/utils/utils.mjs";
import { SYSTEM_ID } from "../constants.mjs";
import { EquipmentHand, EquipmentHidding, EquipmentType, equipmentTypeIdToTypeString } from "../enums/equipment-enums.mjs";

const { StringField, NumberField, BooleanField, ArrayField } = foundry.data.fields;

class EquipmentDataModel extends foundry.abstract.TypeDataModel {
    get isEquipment() {
        return true;
    }

    get canEquip() {
        return true;
    }

    setupValues(data) {
        this.name = data.name;
        this.img = data.img;
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

class VehicleDataModel extends EquipmentDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.VEHICLE, label: "S0.Tipo" }),
            acceleration: new NumberField({ integer: true, initial: 0 }),
            speed: new NumberField({ integer: true, initial: 0 })
        };
    }
}

class SubstanceDataModel extends EquipmentDataModel {
    get canEquip() {
        return false;
    }

    get canUse() {
        return this.actualQuantity > 0;
    }

    get haveQuantity() {
        return true;
    }

    get actualQuantity() {
        const flags = this.parent.flags[SYSTEM_ID];
        return flags.quantity || 0;
    }

    set actualQuantity(value) {
        const flags = this.parent.flags[SYSTEM_ID];
        flags.quantity = value;
    }

    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.SUBSTANCE, label: "S0.Tipo" }),
            effects: new ArrayField(new StringField())
        };
    }
}

class WeaponDataModel extends EquipmentDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            hand: new NumberField({ integer: true, initial: EquipmentHand.ONE_HAND }),
            damage: new NumberField({ integer: true, initial: 0 }),
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

export function generateRandomEquipment() {
    TODO('lembrar de apagar esse método');
    const types = [
        EquipmentType.MELEE,
        EquipmentType.PROJECTILE,
        EquipmentType.ARMOR,
        EquipmentType.VEHICLE,
        EquipmentType.SUBSTANCE
    ];

    const type = types[Math.floor(Math.random() * types.length)];
    const resistance = Math.floor(Math.random() * 8) + 1 + type;

    switch (type) {
        case EquipmentType.MELEE:
            return new MeleeDataModel({
                name: "Espada Improvisada",
                description: "Uma lâmina improvisada, feita com pedaços de metal.",
                resistance,
                type,
                damage: 3,
                occultability: EquipmentHidding.POCKET
            });

        case EquipmentType.PROJECTILE:
            return new ProjectileDataModel({
                name: "Pistola Enferrujada",
                description: "Uma arma antiga, mas ainda funcional.",
                resistance,
                type,
                damage: 4,
                occultability: EquipmentHidding.JACKET,
                capacity: 6,
                cadence: 1,
                short_range: 3,
                medium_range: 5,
                long_range: 8,
                special: false
            });

        case EquipmentType.ARMOR:
            return new ArmorDataModel({
                name: "Colete Rígido",
                description: "Proteção pesada contra impactos.",
                resistance,
                type
            });

        case EquipmentType.VEHICLE:
            return new VehicleDataModel({
                name: "Moto de Fuga",
                description: "Rápida e barulhenta.",
                resistance,
                type,
                acceleration: 2,
                speed: 8
            });

        case EquipmentType.SUBSTANCE:
            return new SubstanceDataModel({
                name: "Estimulante Químico",
                description: "Aumenta reflexos por alguns minutos.",
                resistance,
                type,
                effects: ["+1 Reflexos", "-1 Foco"]
            });

        default:
            throw new Error("Tipo de equipamento inválido");
    }
}