import { ActorEquipmentUtils } from "../core/equipment/actor-equipment.mjs";
import { ActorCharacteristicField, ActorEnhancementField, ActorVirtueField, ActorAttributes, ActorAbilities } from "../field/actor-fields.mjs";
import { ActorTraitField } from "../field/actor-trait-field.mjs";
import { ActorUtils } from "../utils/actor-utils.mjs";

const { HTMLField, NumberField, SchemaField, StringField, ArrayField } = foundry.data.fields;

class ActorDataModel extends foundry.abstract.TypeDataModel {
    prepareDerivedData() {
        super.prepareDerivedData();
    }

    static defineSchema() {
        return {
            name: new StringField({ required: true, label: "S0.Nome" }),
            morfologia: new StringField({ required: true, label: "S0.Morfologia", initial: 'androide' }),
            bairro: new StringField({ required: true, label: "S0.Bairro", initial: 'alfiran' }),
            background: new SchemaField({
                age: new NumberField({ required: false, blank: true }),
                biography: new HTMLField({ required: false, blank: true }),
                personality: new NumberField({ required: false, blank: true }),
            }),
            atributos: new ActorAttributes({ initial: 1 }),
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
            habilidades: new ActorAbilities(),
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
                total: new NumberField({ integer: true, initial: 6 }),
                dano_superficial: new NumberField({ integer: true, initial: 0 }),
                dano_letal: new NumberField({ integer: true, initial: 0 }),
            }),
            sobrecarga: new NumberField({ integer: true, initial: 0 }),
            vida: new NumberField({ initial: 8, min: 0, max: 10 }),
            bonus: new SchemaField({
                atributos: new ActorAttributes({ initial: 0 }),
                habilidades: new ActorAbilities(),
                iniciativa: new NumberField({ integer: true, initial: 0 }),
                movimento: new NumberField({ integer: true, initial: 0 }),
            })
        };
    }

    get actor() {
        return this.parent;
    }

    get equipedProtectItem() {
        return ActorEquipmentUtils.getActorEquippedArmorItem(this.actor);
    }

    get actualVitality() {
        const total = this.actor.system.vitalidade.total;
        return {
            max: total,
            value: total - ActorUtils.getDamage(this.actor)
        };
    }

    get actualProtection() {
        const armorEquipped = ActorEquipmentUtils.getActorEquippedArmorItem(this.actor);
        return {
            max: armorEquipped?.resistence || 0,
            value: armorEquipped?.actual_resistance || 0,
        };
    }
}

class NPCDataModel extends ActorDataModel {
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
            experiencia: new SchemaField({
                usada: new NumberField({ required: false, integer: true, min: 0, initial: 0 }),
                atual: new NumberField({ required: false, integer: true, min: 0, initial: 0 })
            })
        };
    }
}

export async function createActorDataModels() {
    CONFIG.Actor.trackableAttributes = {
        Player: {
            bar: ["actualVitality", "actualProtection"],
            value: ["vitalidade.total", "sobrecarga"]
        },
        NPC: {

        }
    };

    CONFIG.Actor.dataModels = {
        Player: PlayerDataModel,
        NPC: NPCDataModel
    }
}