import { randomId } from "../../scripts/utils/utils.mjs";

const { StringField, SchemaField } = foundry.data.fields;

export class ActorTraitField extends SchemaField {
    constructor({ sourceId, name, particularity } = {}) {
        super({
            id: new StringField({ required: true }),
            sourceId: new StringField({ required: true }),
            name: new StringField({ required: true }),
            particularity: new StringField({ nullable: true, required: false })
        });

        this.id = randomId(10);
        this.sourceId = sourceId;
        this.name = name;
        if (particularity != undefined) {
            this.particularity = particularity;
        }
    }

    static toJson(data = {}) {
        const object = new ActorTraitField(data);
        return object.toObject(object);
    }
}