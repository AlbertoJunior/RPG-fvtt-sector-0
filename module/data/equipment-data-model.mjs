import { DamageType, EquipmentHand, EquipmentHidding, EquipmentType, equipmentTypeIdToTypeString, MeleeSize, SubstanceType } from "../enums/equipment-enums.mjs";
import { SubstanceEffectField, SuperEquipmentField } from "../field/equipment-field.mjs";
import { RollTestDataModel } from "./roll-test-data-model.mjs";

const { StringField, NumberField, BooleanField, ArrayField, SchemaField } = foundry.data.fields;

class BaseEquipmentDataModel extends foundry.abstract.TypeDataModel {
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
            equipped: new BooleanField({ initial: false, label: "S0.Equipado" }),
        };
    }
}

class SubstanceDataModel extends BaseEquipmentDataModel {
    get canEquip() {
        return false;
    }

    get canUse() {
        return this.quantity > 0;
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        const data = this;
        if (data.substance_type != SubstanceType.DRUG) {
            data.effects = [];
        }
    }

    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.SUBSTANCE, label: "S0.Tipo" }),
            substance_type: new NumberField({ integer: true, initial: SubstanceType.DRUG, label: "S0.Itens.Tipo_Substancia" }),
            quantity: new NumberField({ integer: true, initial: 1, minValue: 0, label: "S0.Quantidade" }),
            effects: new ArrayField(new SubstanceEffectField()),
        };
    }
}

class EquipmentDataModel extends BaseEquipmentDataModel {
    get canBeSuper() {
        return true;
    }

    static defineSchema() {
        return {
            ...super.defineSchema(),
            super_equipment: new SuperEquipmentField(),
        };
    }
}

class ArmorDataModel extends EquipmentDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.ARMOR, label: "S0.Tipo" }),
            actual_resistance: new NumberField({ integer: true, initial: 1, label: "S0.Resistencia_Atual" }),
        };
    }
}

class RollableEquipmentDataModel extends EquipmentDataModel {
    get canRoll() {
        return true;
    }

    static defineSchema() {
        return {
            ...super.defineSchema(),
            default_test: new StringField({ initial: "", required: false, blank: true, label: "S0.Teste_Padrao" }),
            possible_tests: new ArrayField(new RollTestDataModel()),
        };
    }
}

class AcessoryDataModel extends RollableEquipmentDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.ACESSORY, label: "S0.Tipo" }),
        };
    }
}

class VehicleDataModel extends RollableEquipmentDataModel {
    get canEquip() {
        return false;
    }

    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.VEHICLE, label: "S0.Tipo" }),
            type_vehicle: new NumberField({ integer: true, initial: 0, label: "S0.Tipo" }),
            actual_resistance: new NumberField({ integer: true, initial: 1, label: "S0.Resistencia_Atual" }),
            acceleration: new NumberField({ integer: true, initial: 0, label: "S0.Aceleracao" }),
            speed: new NumberField({ integer: true, initial: 0, label: "S0.Velocidade" })
        };
    }
}

class WeaponDataModel extends RollableEquipmentDataModel {
    get canRoll() {
        return true;
    }

    get isWeapon() {
        return true;
    }

    static defineSchema() {
        return {
            ...super.defineSchema(),
            hand: new NumberField({ integer: true, initial: EquipmentHand.ONE_HAND, label: "S0.Maos" }),
            damage: new NumberField({ integer: true, initial: 0, label: "S0.Dano" }),
            true_damage: new NumberField({ integer: true, initial: 0, label: "S0.Dano_Automatico" }),
            damage_type: new NumberField({ integer: true, initial: DamageType.LETAL, label: "S0.Tipo_Dano" }),
            occultability: new NumberField({ integer: true, initial: EquipmentHidding.POCKET, label: "S0.Ocultabilidade" })
        };
    }
}

class MeleeDataModel extends WeaponDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.MELEE, label: "S0.Tipo" }),
            size: new NumberField({ integer: true, initial: MeleeSize.SMALL, label: "S0.Tamanho" }),
        };
    }
}

class ProjectileDataModel extends WeaponDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            type: new NumberField({ integer: true, initial: EquipmentType.PROJECTILE, label: "S0.Tipo" }),
            actual_resistance: new NumberField({ integer: true, initial: 1, label: "S0.Resistencia_Atual" }),
            capacity: new NumberField({ integer: true, initial: 1, label: "S0.Capacidade" }),
            cadence: new NumberField({ integer: true, initial: 1, label: "S0.Cadencia" }),
            range: new NumberField({ integer: true, initial: 1, label: "S0.Itens.Alcance" }),
            max_range: new NumberField({ integer: true, initial: 2, label: "S0.Itens.Alcance_Maximo" }),
            special: new BooleanField({ initial: false, label: "S0.Especial" })
        };
    }
}

const EquipmentTypeStringMap = {
    [equipmentTypeIdToTypeString(EquipmentType.MELEE)]: MeleeDataModel,
    [equipmentTypeIdToTypeString(EquipmentType.PROJECTILE)]: ProjectileDataModel,
    [equipmentTypeIdToTypeString(EquipmentType.ARMOR)]: ArmorDataModel,
    [equipmentTypeIdToTypeString(EquipmentType.VEHICLE)]: VehicleDataModel,
    [equipmentTypeIdToTypeString(EquipmentType.SUBSTANCE)]: SubstanceDataModel,
    [equipmentTypeIdToTypeString(EquipmentType.ACESSORY)]: AcessoryDataModel
};

export function equipmentParseData(data) {
    const ModelClass = EquipmentTypeStringMap[data.type] ?? BaseEquipmentDataModel;
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
        Acessory: AcessoryDataModel,
    };
}