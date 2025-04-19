const { SchemaField, NumberField, StringField, BooleanField } = foundry.data.fields;

export class RollTestDataModel extends SchemaField {
    constructor() {
        super({
            id: new StringField({ required: true, blank: false, initial: '', label: "S0.Id" }),
            name: new StringField({ required: true, blank: false, initial: '', label: "S0.Nome" }),
            primary_attribute: new StringField({ required: true, blank: false, initial: '', label: "S0.Atributo" }),
            secondary_attribute: new StringField({ required: true, blank: false, initial: '', label: "S0.Atributo" }),
            ability: new StringField({ required: true, blank: false, initial: '', label: "S0.Habilidade" }),
            bonus: new NumberField({ required: false, initial: 0, minValue: 0, label: "S0.Bonus" }),
            automatic: new NumberField({ required: false, initial: 0, minValue: 0, label: "S0.Automatico" }),
            difficulty: new NumberField({ required: true, initial: 6, maxValue: 10, minValue: 5, label: "S0.Dificuldade" }),
            specialist: new BooleanField({ required: false, initial: false, label: "S0.Especialista" }),
        });
    }
}