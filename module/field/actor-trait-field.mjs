const { StringField, SchemaField } = foundry.data.fields;

export class ActorTraitField extends SchemaField {
    constructor(id, name, particularity) {
        super({
            id: new StringField({ required: true }),
            name: new StringField({ required: true }),
            particularity: new StringField({ nullable: true, required: false })
        });

        this.id = id;
        this.name = name;
        if (particularity != undefined) {
            this.particularity = particularity;
        }
    }
}