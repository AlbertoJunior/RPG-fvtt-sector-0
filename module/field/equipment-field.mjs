import { ActiveEffectsTypes } from "../enums/active-effects-enums.mjs";
import { SuperEquipmentParticularityType } from "../enums/equipment-enums.mjs";

const { NumberField, BooleanField, StringField, SchemaField, ArrayField } = foundry.data.fields;

export class SuperEquipmentField extends SchemaField {
    constructor({ level = 0, effects = [], defects = [] } = {}) {
        super({
            active: new BooleanField({ initial: true }),
            level: new NumberField({ required: true, integer: true, initial: 0, min: 0, max: 5 }),
            effects: new ArrayField(new SuperEquipmentTraitField()),
            defects: new ArrayField(new SuperEquipmentTraitField()),
        }, { initial: null, nullable: true });

        this.level = level;
        this.effects = effects;
        this.defects = defects;
    }

    static toJson(data = {}) {
        const instance = new SuperEquipmentField(data);
        return instance.toObject(instance);
    }
}

export class SuperEquipmentTraitField extends SchemaField {
    constructor({ id, name, need_activate, cost, limit, description, particularity } = {}) {
        super({
            id: new StringField({ required: true }),
            name: new StringField({ required: true }),
            need_activate: new BooleanField({ initial: false }),
            cost: new NumberField({ required: true, integer: true, initial: 1, min: 1 }),
            limit: new NumberField({ required: true, integer: true, initial: 1, min: 1 }),
            description: new StringField({ nullable: true, required: false, initial: '' }),
            particularity: new SuperEquipmentParticularityField(),
        });

        this.id = id;
        this.name = name;
        this.need_activate = need_activate;
        this.cost = cost;
        this.limit = limit;
        this.particularity = particularity;
        if (description != undefined) {
            this.description = description;
        }
    }

    static toJson(data = {}) {
        const instance = new SuperEquipmentTraitField(data);
        return instance.toObject(instance);
    }
}

export class SuperEquipmentParticularityField extends SchemaField {
    constructor({ type, description, change } = {}) {
        super({
            type: new NumberField({ required: true, integer: true, initial: SuperEquipmentParticularityType.TEXT }),
            description: new StringField({ required: false, initial: '' }),
            change: new SchemaField({
                key: new StringField({ required: false, nullable: true, initial: null }),
                value: new NumberField({ required: false, integer: true, initial: 0 }),
            }, { initial: null, nullable: true })
        }, { initial: null, nullable: true });

        this.type = type;
        this.description = description;
        this.change = change;
    }

    static toJson(data = {}) {
        const instance = new SuperEquipmentParticularityField(data);
        return instance.toObject(instance);
    }
}

export class SubstanceEffectField extends SchemaField {
    constructor({ id, description, change, type } = {}) {
        super({
            id: new StringField({ required: true }),
            type: new StringField({ required: false, initial: ActiveEffectsTypes.BUFF }),
            description: new StringField({ required: true }),
            change: new SchemaField({
                key: new StringField({ required: false, nullable: true, initial: null }),
                value: new NumberField({ required: false, integer: true, initial: 0 }),
            }, { initial: null, nullable: true }),
        }, { initial: null, nullable: true });

        this.id = id;
        this.description = description;
        this.type = type;
        this.change = change;
    }

    static toJson(data = {}) {
        const instance = new SubstanceEffectField(data);
        return instance.toObject(instance);
    }
}