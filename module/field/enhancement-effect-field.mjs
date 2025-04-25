import { EffectChangeValueType } from "../enums/enhancement-enums.mjs";

const { SchemaField, StringField, NumberField } = foundry.data.fields;

export class EnhancementEffectDataChange extends SchemaField {
    constructor(key, value = 0) {
        super({
            key: new StringField({ required: true, initial: key }),
            value: new NumberField({ integer: true, required: true, initial: value }),
            typeOfValue: new NumberField({ integer: true, required: true, initial: EffectChangeValueType.FIXED }),
            otherValue: new StringField({ required: false, initial: undefined }),
            mode: new NumberField({ integer: true, required: false, initial: CONST.ACTIVE_EFFECT_MODES.ADD }),
        });        
    }
}