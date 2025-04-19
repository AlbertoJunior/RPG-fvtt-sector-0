import { EnhancementEffectDataChange } from "./enhancement-effect-field.mjs";
import { RollTestDataModel } from "../data/roll-test-data-model.mjs";

const { SchemaField, StringField, NumberField, ArrayField } = foundry.data.fields;

export class EnhancementEffectField extends SchemaField {
    constructor(id, name, level, overload, duration, requirement, effectChanges = [], possibleTests = []) {
        super({
            id: new StringField({ required: true, initial: '' }),
            name: new StringField({ required: true, initial: '' }),
            level: new NumberField({ required: true, integer: true, initial: 1, min: 1, max: 5 }),
            overload: new NumberField({ required: true, integer: true, initial: 0 }),
            duration: new StringField({ required: true, initial: '' }),
            requirement: new ArrayField(new StringField()),
            effectChanges: new ArrayField(new EnhancementEffectDataChange()),
            possible_tests: new ArrayField(new RollTestDataModel()),
        });

        this.id = id;
        this.name = name;
        this.level = level;
        this.overload = overload;
        this.duration = duration;
        this.requirement = requirement;
        this.effectChanges = effectChanges;
        this.possible_tests = possibleTests;
    }

    static _toJson(id, name, level, overload, duration, requirement, effectChanges = [], possibleTests = []) {
        const object = new EnhancementEffectField(id, name, level, overload, duration, requirement, effectChanges, possibleTests);
        return object.toObject(object);
    }
}