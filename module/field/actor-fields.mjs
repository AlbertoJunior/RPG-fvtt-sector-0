const { NumberField, SchemaField, HTMLField } = foundry.data.fields;

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
    constructor() {
        super({
            nv1: new HTMLField(),
            nv2: new HTMLField(),
            nv3: new HTMLField(),
            nv4: new HTMLField(),
            nv5: new HTMLField(),
        });
    }
}