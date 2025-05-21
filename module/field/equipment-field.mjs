const { NumberField, StringField, SchemaField, ArrayField } = foundry.data.fields;

export class SuperEquipmentField extends SchemaField {
    constructor({ level = 1, quality = [], defect = [] } = {}) {
        super({
            level: new NumberField({ required: true, integer: true, initial: 1, min: 1, max: 5 }),
            quality: new ArrayField(new SuperEquipmentTraitField()),
            defect: new ArrayField(new SuperEquipmentTraitField()),
        });

        this.level = level;
        this.quality = quality;
        this.defect = defect;
    }

    static _toJson(data = {}) {
        const instance = new SuperEquipmentField(data);
        return instance.toObject(instance);
    }
}

class SuperEquipmentTraitField extends SchemaField {
    constructor(id, name, cost, particularity) {
        super({
            id: new StringField({ required: true }),
            name: new StringField({ required: true }),
            cost: new NumberField({ required: true, integer: true, initial: 1, min: 1 }),
            particularity: new StringField({ nullable: true, required: false })
        });

        this.id = id;
        this.name = name;
        this.cost = cost;
        if (particularity != undefined) {
            this.particularity = particularity;
        }
    }

    static _toJson(id, name, cost, particularity) {
        const object = new SuperEquipmentTraitField(id, name, cost, particularity);
        return object.toObject(object);
    }
}