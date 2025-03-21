const { HTMLField, NumberField, SchemaField, StringField, ArrayField } = foundry.data.fields;

class ActorDataModel extends foundry.abstract.TypeDataModel {
    async applyDamage(damage) {
        console.log('applyDamage')

        // Always take a minimum of 1 damage, and round to the nearest integer.
        damage = Math.round(Math.max(1, damage));

        // Update the health.
        const { value } = this.system.vitalidade;
        await this.update({ "system.vitalidade.value": value - damage });

        // Log a message.
        await ChatMessage.implementation.create({
            content: `${this.name} took ${damage} damage!`
        });
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        console.log('prepareDerivedData')
        // for (const [a, value] of Object.entries(this.atributos)) {
        //     console.log(`${a} -> ${value}`);
        // }
    }

    static defineSchema() {
        return {
            name: new StringField({ required: true }),
            background: new SchemaField({
                biography: new HTMLField({ required: true, blank: true })
            }),
            atributos: new SchemaField({
                forca: new NumberField({ nullable: false, integer: true, min: 0, initial: 1, max: 6, label: "S0.Forca" }),
                destreza: new NumberField({ nullable: false, integer: true, min: 0, initial: 1, max: 6, label: "S0.Destreza" }),
                vigor: new NumberField({ nullable: false, integer: true, min: 0, initial: 1, max: 6, label: "S0.Vigor" }),
                percepcao: new NumberField({ nullable: false, integer: true, min: 0, initial: 1, max: 6, label: "S0.Percepcao" }),
                carisma: new NumberField({ nullable: false, integer: true, min: 0, initial: 1, max: 6, label: "S0.Carisma" }),
                inteligencia: new NumberField({ nullable: false, integer: true, min: 0, initial: 1, max: 6, label: "S0.Inteligencia" }),
            }),
            habilidades: new SchemaField({
                armas_brancas: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                armas_de_projecao: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                atletismo: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                briga: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                engenharia: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                expressao: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                furtividade: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                hacking: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                investigacao: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                medicina: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                manha: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                performance: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                pilotagem: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
                quimica: new NumberField({ integer: true, min: 0, initial: 0, max: 6, lable: "S0." }),
            }),
            linguas: new ArrayField(new StringField()),
            vitalidade: new SchemaField({
                min: new NumberField({ initial: 0 }),
                value: new NumberField({ initial: 6 }),
                max: new NumberField({ initial: 18 })
            }),
            sobrecarga: new SchemaField({
                min: new NumberField({ integer: true, initial: 0, min: 0, max: 5 }),
                value: new NumberField({ integer: true, initial: 0, min: 0, max: 5 }),
                max: new NumberField({ integer: true, initial: 5, min: 0, max: 5 })
            }),
            equipamentos: new ArrayField(new StringField())
        };
    }
}

class BasicEnemyDataModel extends ActorDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema()
        };
    }
}

class PlayerDataModel extends ActorDataModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            experience: new SchemaField({
                used: new NumberField({ required: false, integer: true, min: 0, initial: 0 }),
                current: new NumberField({ required: false, integer: true, min: 0, initial: 0 })
            })
        };
    }
}

export function createDataModels() {
    CONFIG.Actor.trackableAttributes = {
        Jogador: {
            bar: ["system.vitalidade", "system.sobrecarga"],
            value: ["progress"]
        },
        Mestre: {
            bar: ["system.vitalidade", "system.sobrecarga"],
            value: ["level"]
        }
    };

    // Registrar o modelo de dados personalizado
    CONFIG.Actor.dataModels = {
        Jogador: PlayerDataModel,
        Mestre: PlayerDataModel,
        BasicEnemy: BasicEnemyDataModel,
    }

    console.log('Modelos de dados de ator registrados');
}