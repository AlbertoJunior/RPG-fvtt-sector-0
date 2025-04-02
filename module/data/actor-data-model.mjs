import { ActorAttributeField, ActorAbilityField, ActorCharacteristicField, ActorEnhancementField, ActorVirtueField, ActorAttribute } from "../field/actor-fields.mjs";
import { ActorTraitField } from "../field/actor-trait-field.mjs";

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
    }

    static defineSchema() {
        return {
            name: new StringField({ required: true }),
            morfologia: new StringField({ required: true, label: "S0.Morfologia" }),
            bairro: new StringField({ required: true, label: "S0.Bairro" }),
            background: new SchemaField({
                age: new NumberField({ required: false, blank: true }),
                biography: new HTMLField({ required: false, blank: true }),
                personality: new NumberField({ required: false, blank: true }),
            }),
            atributos: new SchemaField({
                forca: new ActorAttributeField("S0.Forca"),
                destreza: new ActorAttributeField("S0.Destreza"),
                vigor: new ActorAttributeField("S0.Vigor"),
                percepcao: new ActorAttributeField("S0.Percepcao"),
                carisma: new ActorAttributeField("S0.Carisma"),
                inteligencia: new ActorAttributeField("S0.Inteligencia"),
            }),
            repertorio: new SchemaField({
                aliados: new ActorCharacteristicField("S0.Aliados"),
                arsenal: new ActorCharacteristicField("S0.Arsenal"),
                informantes: new ActorCharacteristicField("S0.Informantes"),
                recursos: new ActorCharacteristicField("S0.Recursos"),
                superequipamentos: new ActorCharacteristicField("S0.SuperEquipamentos")
            }),
            virtudes: new SchemaField({
                consciencia: new ActorVirtueField("S0.Consciencia"),
                perseveranca: new ActorVirtueField("S0.Perseveranca"),
                quietude: new ActorVirtueField("S0.Quietude")
            }),
            nivel_de_procurado: new ActorCharacteristicField("S0.NivelProcurado"),
            influencia: new ActorCharacteristicField("S0.Influencia"),
            nucleo: new NumberField({ nullable: false, integer: true, min: 0, initial: 1, max: 5, label: "S0.Nucleo" }),
            habilidades: new SchemaField({
                armas_brancas: new ActorAbilityField("S0.Armas_Brancas"),
                armas_de_projecao: new ActorAbilityField("S0.Armas_de_Projecao"),
                atletismo: new ActorAbilityField("S0.Atletismo"),
                briga: new ActorAbilityField("S0.Briga"),
                engenharia: new ActorAbilityField("S0.Engenharia"),
                expressao: new ActorAbilityField("S0.Expressao"),
                furtividade: new ActorAbilityField("S0.Furtividade"),
                hacking: new ActorAbilityField("S0.Hacking"),
                investigacao: new ActorAbilityField("S0.Investigacao"),
                medicina: new ActorAbilityField("S0.Medicina"),
                manha: new ActorAbilityField("S0.Manha"),
                performance: new ActorAbilityField("S0.Performance"),
                pilotagem: new ActorAbilityField("S0.Pilotagem"),
                quimica: new ActorAbilityField("S0.Quimica"),
            }),
            linguas: new ArrayField(new StringField()),
            aprimoramentos: new SchemaField({
                aprimoramento_1: new ActorEnhancementField(),
                aprimoramento_2: new ActorEnhancementField(),
                aprimoramento_3: new ActorEnhancementField(),
                aprimoramento_4: new ActorEnhancementField()
            }),
            tracos: new SchemaField({
                bons: new ArrayField(new ActorTraitField()),
                ruins: new ArrayField(new ActorTraitField())
            }),
            vitalidade: new SchemaField({
                value: new NumberField({ integer: true, initial: 6 }),
                superficial_damage: new NumberField({ integer: true, initial: 0 }),
                letal_damage: new NumberField({ integer: true, initial: 0 }),
            }),
            sobrecarga: new SchemaField({
                value: new NumberField({ integer: true, initial: 0 }),
                current: new NumberField({ integer: true, initial: 0 }),
            }),
            bonus: new SchemaField({
                atributos: new ActorAttribute(0),
                iniciativa: new NumberField({ integer: true, initial: 0 }),
                vitalidade: new NumberField({ integer: true, initial: 0 }),
                movimento: new NumberField({ integer: true, initial: 0 }),
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

export async function createActorDataModels() {
    CONFIG.Actor.trackableAttributes = {
        Jogador: {
            bar: ["system.vitalidade.value", "system.sobrecarga"],
            value: ["progress"]
        },
        Mestre: {
            bar: ["system.vitalidade.value", "system.sobrecarga"],
            value: ["level"]
        },
        Inimigo: {
            bar: ["system.vitalidade.value", "system.sobrecarga"],
            value: ["level"]
        }
    };

    CONFIG.Actor.dataModels = {
        Jogador: PlayerDataModel,
        Mestre: PlayerDataModel,
        Inimigo: BasicEnemyDataModel,
    }
}