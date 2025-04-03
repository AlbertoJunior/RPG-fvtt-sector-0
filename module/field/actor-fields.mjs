import { EnhancementEffectField } from "./actor-enhancement-field.mjs";

const { NumberField, SchemaField, StringField } = foundry.data.fields;

export class ActorAbilityField extends NumberField {
    constructor(label) {
        super({ integer: true, min: 0, initial: 0, max: 6, label: label });
    }
}

export class ActorAttribute extends SchemaField {
    constructor(initial = 1) {
        super({
            forca: new ActorAttributeField("S0.Forca", initial),
            destreza: new ActorAttributeField("S0.Destreza", initial),
            vigor: new ActorAttributeField("S0.Vigor", initial),
            percepcao: new ActorAttributeField("S0.Percepcao", initial),
            carisma: new ActorAttributeField("S0.Carisma", initial),
            inteligencia: new ActorAttributeField("S0.Inteligencia", initial),
        });
    }
}

export class ActorAttributeField extends NumberField {
    constructor(label, initial = 1) {
        super({ nullable: false, integer: true, min: 0, initial: initial, max: 6, label: label });
    }
}

export class ActorCharacteristicField extends NumberField {
    constructor(label) {
        super({ nullable: false, integer: true, min: 0, initial: 0, max: 5, label: label });
    }
}

export class ActorVirtueField extends SchemaField {
    constructor(label) {
        super({
            level: new NumberField({ integer: true, min: 0, initial: 1, max: 5, label: label }),
            used: new NumberField({ integer: true, min: 0, initial: 0, max: 5 })
        });
    }
}

export class ActorEnhancementField extends SchemaField {
    constructor(id, name) {
        super({
            id: new StringField({ required: true }),
            name: new StringField({ required: true }),
            levels: new SchemaField({
                nv1: new EnhancementEffectField(),
                nv2: new EnhancementEffectField(),
                nv3: new EnhancementEffectField(),
                nv4: new EnhancementEffectField(),
                nv5: new EnhancementEffectField(),
            })
        });

        this.id = id;
        this.name = name;
    }

    static _toJson(id, name) {
        const object = new ActorEnhancementField(id, name);
        return object.toObject(object);
    }
}