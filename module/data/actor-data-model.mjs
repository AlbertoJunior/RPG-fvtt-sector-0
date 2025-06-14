import { ActorEquipmentUtils } from "../core/actor/actor-equipment.mjs";
import { Setor0TokenDocument } from "../core/token/setor0-token.mjs";
import { ActorCharacteristicField, ActorEnhancementField, ActorAttributes, ActorAbilities, ActorVirtues } from "../field/actor-fields.mjs";
import { ActorTraitField } from "../field/actor-trait-field.mjs";
import { ActorUtils } from "../core/actor/actor-utils.mjs";
import { RollTestField } from "../field/roll-test-field.mjs";
import { NpcSkill } from "../field/npc-fields.mjs";
import { NpcQualityRepository } from "../repository/npc-quality-repository.mjs";
import { getObject } from "../../scripts/utils/utils.mjs";
import { BaseActorCharacteristicType } from "../enums/characteristic-enums.mjs";
import { NpcUtils } from "../core/npc/npc-utils.mjs";
import { MorphologyRepository } from "../repository/morphology-repository.mjs";
import { DistrictRepository } from "../repository/district-repository.mjs";

const { NumberField, SchemaField, StringField, ArrayField } = foundry.data.fields;

class BaseActorDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            morfologia: new StringField({ required: true, label: "S0.Morfologia", initial: MorphologyRepository.TYPES.HUMAN.id }),
            bairro: new StringField({ required: true, label: "S0.Bairro", initial: DistrictRepository.TYPES.ALFIRAN.id }),
            background: new SchemaField({
                assignment: new StringField({ required: false, nullable: true }),
                biography: new StringField({ required: false, nullable: true }),
            }),
            vitalidade: new SchemaField({
                total: new NumberField({ integer: true, initial: 6 }),
                dano_superficial: new NumberField({ integer: true, initial: 0 }),
                dano_letal: new NumberField({ integer: true, initial: 0 }),
            }),
            nivel_de_procurado: new ActorCharacteristicField("S0.NivelProcurado"),
            influencia: new ActorCharacteristicField("S0.Influencia"),
        }
    }

    get actor() {
        return this.parent;
    }

    get actualVitality() {
        const total = getObject(this.actor, BaseActorCharacteristicType.VITALITY.TOTAL) || 0;
        return {
            max: total,
            value: total - ActorUtils.getDamage(this.actor)
        };
    }

    get actualProtection() {
        return ActorEquipmentUtils.getArmorEquippedValues(this.actor);
    }
}

class PlayerDataModel extends BaseActorDataModel {

    get actualPM() {
        return ActorUtils.getActualMovimentPoints(this.actor);
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }

    static defineSchema() {
        return {
            ...super.defineSchema(),
            atributos: new ActorAttributes({ initial: 1 }),
            repertorio: new SchemaField({
                aliados: new ActorCharacteristicField("S0.Aliados"),
                arsenal: new ActorCharacteristicField("S0.Arsenal"),
                informantes: new ActorCharacteristicField("S0.Informantes"),
                recursos: new ActorCharacteristicField("S0.Recursos"),
                superequipamentos: new ActorCharacteristicField("S0.SuperEquipamentos")
            }),
            virtudes: new ActorVirtues(),
            nucleo: new NumberField({ integer: true, min: 0, initial: 1, max: 5, label: "S0.Nucleo" }),
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
            sobrecarga: new NumberField({ integer: true, initial: 0 }),
            vida: new NumberField({ integer: true, initial: 8, min: 0, max: 10 }),
            aliados: new ArrayField(new StringField()),
            informantes: new ArrayField(new StringField()),
            experiencia: new SchemaField({
                usada: new NumberField({ required: false, integer: true, min: 0, initial: 0 }),
                atual: new NumberField({ required: false, integer: true, min: 0, initial: 0 })
            }),
            atalhos: new ArrayField(new RollTestField()),
            bonus: new SchemaField({
                atributos: new ActorAttributes({ initial: 0 }),
                habilidades: new ActorAbilities(),
                virtudes: new SchemaField({
                    consciencia: new NumberField({ integer: true, initial: 0, label: "S0.Consciencia" }),
                    perseveranca: new NumberField({ integer: true, initial: 0, label: "S0.Perseveranca" }),
                    quietude: new NumberField({ integer: true, initial: 0, label: "S0.Quietude" }),
                }),
                iniciativa: new NumberField({ integer: true, initial: 0 }),
                movimento: new NumberField({ integer: true, initial: 0 }),
                vitalidade: new NumberField({ integer: true, initial: 0 }),
                penalidade_dano: new NumberField({ integer: true, initial: 0 }),
                penalidade_fixa: new NumberField({ integer: true, initial: 0 }),
                ofensivo_corpo_a_corpo: new NumberField({ integer: true, initial: 0 }),
                ofensivo_longo_alcance: new NumberField({ integer: true, initial: 0 }),
                defensivo: new NumberField({ integer: true, initial: 0 }),
                defensivo_multiplo: new NumberField({ integer: true, initial: 0 }),
            })
        };
    }
}

class NPCDataModel extends BaseActorDataModel {

    get actualPM() {
        return NpcUtils.getPm(this.actor);
    }

    prepareDerivedData() {
        super.prepareDerivedData();

        const data = this;
        const bonusOrDebuff = NpcQualityRepository.getItem(data.qualidade)?.bonusOrDebuff || 0;

        data.habilidades.primaria.valor = Math.max(7 + bonusOrDebuff, 0);
        data.habilidades.secundaria.valor = Math.max(5 + bonusOrDebuff, 0);
        data.habilidades.terciaria.valor = Math.max(3 + bonusOrDebuff, 0);
        data.habilidades.quaternaria.valor = Math.max(0 + bonusOrDebuff, 0);

        if (bonusOrDebuff <= 0) {
            data.habilidades.quaternaria = null;
        }

        if (bonusOrDebuff <= -4) {
            data.habilidades.terciaria = null;
        }
    }

    static defineSchema() {
        const defaultQuality = NpcQualityRepository.TYPES.NORMAL;
        return {
            ...super.defineSchema(),
            qualidade: new StringField({ required: true, initial: defaultQuality.id, label: defaultQuality.label }),
            habilidades: new SchemaField({
                primaria: new NpcSkill(),
                secundaria: new NpcSkill(),
                terciaria: new NpcSkill(),
                quaternaria: new NpcSkill(),
            }),
            bonus: new SchemaField({
                iniciativa: new NumberField({ integer: true, initial: 0 }),
            })
        };
    }
}

export async function createActorDataModels() {
    Setor0TokenDocument.setValuesOnMapped([
        { id: 'actualVitality', label: 'Vitalidade_Atual' },
        { id: 'actualProtection', label: 'Protecao_Atual' },
        { id: 'vitalidade.total', label: 'Vitalidade_Total' },
        { id: 'sobrecarga', label: 'Sobrecarga' },
        { id: 'actualPM', label: 'Pontos_De_Movimento_Atuais' },
    ]);

    CONFIG.Actor.trackableAttributes = {
        Player: {
            bar: ["actualVitality", "actualProtection"],
            value: ["vitalidade.total", "sobrecarga", "actualPM"]
        },
        NPC: {
            bar: ["actualVitality", "actualProtection"],
            value: ["vitalidade.total", "actualPM"]
        }
    };

    CONFIG.Actor.dataModels = {
        Player: PlayerDataModel,
        NPC: NPCDataModel
    };
}