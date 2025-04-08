import { EffectChangeValueType } from "../enums/enhancement-enums.mjs";

const { SchemaField, StringField, NumberField, ArrayField } = foundry.data.fields;

export class EnhancementEffectDataChange extends SchemaField {
    constructor(key, value) {
        super({
            key: new StringField({ required: true, initial: key }),
            value: new NumberField({ integer: true, required: true, initial: value }),
            typeOfValue: new NumberField({ integer: true, required: true, initial: EffectChangeValueType.FIXED }),
        });
    }
}

export class EnhancementEffectField extends SchemaField {
    constructor(id, name, level, overload, duration, requirement, effectChanges = []) {
        super({
            id: new StringField({ required: true, initial: '' }),
            name: new StringField({ required: true, initial: '' }),
            level: new NumberField({ required: true, integer: true, initial: 1, min: 1, max: 5 }),
            overload: new NumberField({ required: true, integer: true, initial: 0 }),
            duration: new StringField({ required: true, initial: '' }),
            requirement: new ArrayField(new StringField()),
            effectChanges: new ArrayField(new EnhancementEffectDataChange())
        });

        this.id = id;
        this.name = name;
        this.level = level;
        this.overload = overload;
        this.duration = duration;
        this.requirement = requirement;
        this.effectChanges = effectChanges;
    }

    static _toJson(id, name, level, overload, duration, requirement, effectChanges = []) {
        const object = new EnhancementEffectField(id, name, level, overload, duration, requirement, effectChanges);
        return object.toObject(object);
    }
}