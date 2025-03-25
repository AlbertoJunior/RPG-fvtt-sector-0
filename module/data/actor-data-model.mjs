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
        //console.log('prepareDerivedData')
        // for (const [a, value] of Object.entries(this.atributos)) {
        //     console.log(`${a} -> ${value}`);
        // }
    }

    static defineSchema() {
        return {
            name: new StringField({ required: true }),
            morfologia: new StringField({ required: true, label: "S0.Morfologia" }),
            bairro: new StringField({ required: true, initial: "S0.Alfiran", label: "S0.Bairro" }),
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
            repertorio: new SchemaField({
                aliados: new NumberField({ nullable: false, integer: true, min: 0, initial: 0, max: 5, label: "S0.Aliados" }),
                arsenal: new NumberField({ nullable: false, integer: true, min: 0, initial: 0, max: 5, label: "S0.Arsenal" }),
                informantes: new NumberField({ nullable: false, integer: true, min: 0, initial: 0, max: 5, label: "S0.Informantes" }),
                recursos: new NumberField({ nullable: false, integer: true, min: 0, initial: 0, max: 5, label: "S0.Recursos" }),
                superequipamentos: new NumberField({ nullable: false, integer: true, min: 0, initial: 0, max: 5, label: "S0.SuperEquipamentos" })
            }),
            virtudes: new SchemaField({
                consciencia: new NumberField({ nullable: false, integer: true, min: 0, initial: 1, max: 5, label: "S0.Consciencia" }),
                perseveranca: new NumberField({ nullable: false, integer: true, min: 0, initial: 1, max: 5, label: "S0.Perseveranca" }),
                quietude: new NumberField({ nullable: false, integer: true, min: 0, initial: 1, max: 5, label: "S0.Quietude" })
            }),
            nivel_de_procurado: new NumberField({ nullable: false, integer: true, min: 0, initial: 0, max: 5, label: "S0.NivelProcurado" }),
            influencia: new NumberField({ nullable: false, integer: true, min: 0, initial: 0, max: 5, label: "S0.Influencia" }),
            habilidades: new SchemaField({
                armas_brancas: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Armas_Brancas" }),
                armas_de_projecao: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Armas_de_Projecao" }),
                atletismo: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Atletismo" }),
                briga: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Briga" }),
                engenharia: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Engenharia" }),
                expressao: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Expressao" }),
                furtividade: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Furtividade" }),
                hacking: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Hacking" }),
                investigacao: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Investigacao" }),
                medicina: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Medicina" }),
                manha: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Manha" }),
                performance: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Performance" }),
                pilotagem: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Pilotagem" }),
                quimica: new NumberField({ integer: true, min: 0, initial: 0, max: 6, label: "S0.Quimica" }),
            }),
            linguas: new ArrayField(new StringField()),
            aprimoramentos: new SchemaField({
                aprimoramento_1: new SchemaField({
                    nv1: new HTMLField(),
                    nv2: new HTMLField(),
                    nv3: new HTMLField(),
                    nv4: new HTMLField(),
                    nv5: new HTMLField(),
                }),
                aprimoramento_2: new SchemaField({
                    nv1: new HTMLField(),
                    nv2: new HTMLField(),
                    nv3: new HTMLField(),
                    nv4: new HTMLField(),
                    nv5: new HTMLField(),
                }),
                aprimoramento_3: new SchemaField({
                    nv1: new HTMLField(),
                    nv2: new HTMLField(),
                    nv3: new HTMLField(),
                    nv4: new HTMLField(),
                    nv5: new HTMLField(),
                }),
                aprimoramento_4: new SchemaField({
                    nv1: new HTMLField(),
                    nv2: new HTMLField(),
                    nv3: new HTMLField(),
                    nv4: new HTMLField(),
                    nv5: new HTMLField(),
                })
            }),
            vitalidade: new SchemaField({
                min: new NumberField({ initial: 0 }),
                value: new NumberField({ initial: 6 }),
                max: new NumberField({ initial: 6 })
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