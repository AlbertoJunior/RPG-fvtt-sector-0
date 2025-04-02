const { SchemaField, StringField, NumberField, ArrayField } = foundry.data.fields;

export class EnhancementEffectDataChange extends SchemaField {
    constructor(key, value) {
        super({
            key: new StringField({ required: true, initial: key }),
            value: new NumberField({ integer: true, required: true, initial: value }),
        });
    }
}

export class EnhancementEffectField extends SchemaField {
    constructor(id, name, level, duration, requirement, effectChanges = []) {
        super({
            id: new StringField({ required: true }),
            name: new StringField({ required: true }),
            level: new NumberField({ integer: true, initial: 1, min: 1, max: 5 }),
            overload: new NumberField({ integer: true, initial: 0 }),
            duration: new StringField({ initial: '' }),
            requirement: new ArrayField(new StringField()),
            effectChanges: new ArrayField(new EnhancementEffectDataChange())
        });

        this.id = id;
        this.name = name;
        this.level = level;
        this.duration = duration;
        this.requirement = requirement;
        this.effectChanges = effectChanges;
    }
}