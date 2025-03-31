const { StringField, SchemaField, ArrayField } = foundry.data.fields;

export class EnhancementLevelField extends SchemaField {
    constructor(id, name, requirement) {
        super({
            id: new StringField({ required: true }),
            name: new StringField({ required: true }),
            requirement: new ArrayField(new StringField()),
        });

        this.id = id;
        this.name = name;
        this.requirement = requirement;
    }
}