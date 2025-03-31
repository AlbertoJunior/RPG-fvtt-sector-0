import { EnhancementLevelField } from "./actor-enhancement-field.mjs";

const { NumberField, SchemaField, StringField } = foundry.data.fields;

export class ActorAbilityField extends NumberField {
    constructor(label) {
        super({ integer: true, min: 0, initial: 0, max: 6, label: label });
    }
}

export class ActorAttributeField extends NumberField {
    constructor(label) {
        super({ nullable: false, integer: true, min: 0, initial: 1, max: 6, label: label });
    }
}

export class ActorCharacteristicField extends NumberField {
    constructor(label) {
        super({ nullable: false, integer: true, min: 0, initial: 0, max: 5, label: label });
    }
}

export class ActorEnhancementField extends SchemaField {
    constructor(id, name) {
        super({
            id: new StringField({ required: true }),
            name: new StringField({ required: true }),
            levels: new SchemaField({
                nv1: new EnhancementLevelField(),
                nv2: new EnhancementLevelField(),
                nv3: new EnhancementLevelField(),
                nv4: new EnhancementLevelField(),
                nv5: new EnhancementLevelField(),
            })
        });
        
        this.id = id;
        this.name = name;
    }
}