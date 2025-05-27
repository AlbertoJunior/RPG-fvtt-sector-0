import { ActiveEffectsTypes } from "../enums/active-effects-enums.mjs";

const { NumberField, StringField, SchemaField, ArrayField } = foundry.data.fields;

export class SuperEquipmentField extends SchemaField {
    constructor({ level = 0, effects = [], defects = [] } = {}) {
        super({
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
    constructor({ id, name, cost, limit, description, particularity } = {}) {
        super({
            id: new StringField({ required: true }),
            name: new StringField({ required: true }),
            cost: new NumberField({ required: true, integer: true, initial: 1, min: 1 }),
            limit: new NumberField({ required: true, integer: true, initial: 1, min: 1 }),
            description: new StringField({ nullable: true, required: false, initial: '' }),
            particularity: new StringField({ nullable: true, required: false })
        });

        this.id = id;
        this.name = name;
        this.cost = cost;
        this.limit = limit;
        if (description != undefined) {
            this.description = description;
        }
        if (particularity != undefined) {
            this.particularity = particularity;
        }
    }

    static toJson(data = {}) {
        const instance = new SuperEquipmentTraitField(data);
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