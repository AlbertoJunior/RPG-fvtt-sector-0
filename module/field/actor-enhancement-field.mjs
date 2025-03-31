const { StringField, SchemaField, ArrayField } = foundry.data.fields;

export class EnhancementLevelField extends SchemaField {
    constructor() {
        super({
            enhancement: new StringField({ required: true }),
            id: new StringField({ required: true }),
            name: new StringField({ required: true }),
            requirement: new ArrayField(new StringField()),
        });
    }
}