
export const BaseActorCharacteristicType = Object.freeze({
    NAME: { id: 'name', system: 'system.name' },
    MORPHOLOGY: { id: 'morphology', system: 'system.morfologia' },
    DISTRICT: { id: 'bairro', system: 'system.bairro' },
    BACKGROUND: {
        id: 'background',
        system: 'system.background',
        ASSIGNMENT: { id: 'assignment', system: 'system.background.assignment' },
    },
    BOUNTY: { id: 'nivel_de_procurado', system: 'system.nivel_de_procurado' },
    INFLUENCE: { id: 'influencia', system: 'system.influencia' },
    VITALITY: {
        id: 'vitalidade',
        system: 'system.vitalidade',
        TOTAL: { id: 'vitalidade_total', system: 'system.vitalidade.total' },
        SUPERFICIAL_DAMAGE: { id: 'vitalidade_dano_superficial', system: 'system.vitalidade.dano_superficial' },
        LETAL_DAMAGE: { id: 'vitalidade_dano_letal', system: 'system.vitalidade.dano_letal' },
    },
});

export const CharacteristicType = Object.freeze({
    NAME: { id: 'name', system: 'system.name' },
    CORE: { id: 'core', system: 'system.nucleo' },
    OVERLOAD: { id: 'sobrecarga', system: 'system.sobrecarga' },
    LIFE: { id: 'vida', system: 'system.vida' },
    ATTRIBUTES: {
        id: 'atributos',
        system: 'system.atributos',
        STRENGTH: { id: 'forca', system: 'system.atributos.forca' },
        DEXTERITY: { id: 'destreza', system: 'system.atributos.destreza' },
        STAMINA: { id: 'vigor', system: 'system.atributos.vigor' },
        PERCEPTION: { id: 'percepcao', system: 'system.atributos.percepcao' },
        CHARISMA: { id: 'carisma', system: 'system.atributos.carisma' },
        INTELLIGENCE: { id: 'inteligencia', system: 'system.atributos.inteligencia' },
    },
    VIRTUES: {
        id: 'virtudes',
        system: 'system.virtudes',
        CONSCIOUSNESS: {
            id: 'consciencia',
            system: 'system.virtudes.consciencia',
            LEVEL: { id: 'consciencia_level', system: 'system.virtudes.consciencia.level' },
            USED: { id: 'consciencia_usada', system: 'system.virtudes.consciencia.used' },
        },
        PERSEVERANCE: {
            id: 'perseveranca',
            system: 'system.virtudes.perseveranca',
            LEVEL: { id: 'perseveranca_level', system: 'system.virtudes.perseveranca.level' },
            USED: { id: 'perseveranca_usada', system: 'system.virtudes.perseveranca.used' },
        },
        QUIETNESS: {
            id: 'quietude',
            system: 'system.virtudes.quietude',
            LEVEL: { id: 'quietude_level', system: 'system.virtudes.quietude.level' },
            USED: { id: 'quietude_usada', system: 'system.virtudes.quietude.used' },
        },
    },
    REPERTORY: {
        id: 'repertorio',
        system: 'system.repertorio',
        ALLIES: { id: "aliados", system: "system.repertorio.aliados" },
        ARSENAL: { id: "arsenal", system: "system.repertorio.arsenal" },
        INFORMANTS: { id: "informantes", system: "system.repertorio.informantes" },
        RESOURCES: { id: "recursos", system: "system.repertorio.recursos" },
        SUPEREQUIPMENTS: { id: "superequipamentos", system: "system.repertorio.superequipamentos" },
    },
    SKILLS: {
        id: 'habilidades',
        system: 'system.habilidades',
        MELEE: { id: 'armas_brancas', system: 'system.habilidades.armas_brancas' },
        PROJECTILE: { id: 'armas_de_projecao', system: 'system.habilidades.armas_de_projecao' },
        ATHLETICS: { id: 'atletismo', system: 'system.habilidades.atletismo' },
        BRAWL: { id: 'briga', system: 'system.habilidades.briga' },
        ENGINEERING: { id: 'engenharia', system: 'system.habilidades.engenharia' },
        EXPRESSION: { id: 'expressao', system: 'system.habilidades.expressao' },
        FURTIVITY: { id: 'furtividade', system: 'system.habilidades.furtividade' },
        HACKING: { id: 'hacking', system: 'system.habilidades.hacking' },
        INVESTIGATION: { id: 'investigacao', system: 'system.habilidades.investigacao' },
        STREETWISE: { id: 'manha', system: 'system.habilidades.manha' },
        MEDICINE: { id: 'medicina', system: 'system.habilidades.medicina' },
        PERFORMANCE: { id: 'performance', system: 'system.habilidades.performance' },
        PILOTING: { id: 'pilotagem', system: 'system.habilidades.pilotagem' },
        CHEMISTRY: { id: 'quimica', system: 'system.habilidades.quimica' },
    },
    LANGUAGE: { id: 'linguas', system: 'system.linguas' },
    TRAIT: {
        id: 'tracos',
        system: 'system.tracos',
        GOOD: {
            id: 'bons',
            system: 'system.tracos.bons',
        },
        BAD: {
            id: 'ruins',
            system: 'system.tracos.ruins',
        }
    },
    ENHANCEMENT_ALL: { id: 'enhancement_all', system: 'system.aprimoramentos' },
    ENHANCEMENT: { id: 'enhancement', system: 'system.aprimoramentos.aprimoramento' },
    BONUS: {
        id: 'bonus',
        system: 'system.bonus',
        ATTRIBUTES: {
            id: 'bonus_atributos',
            system: 'system.bonus.atributos',
            STRENGTH: { id: 'bonus_atributos_strength', system: 'system.bonus.atributos.forca' },
            DEXTERITY: { id: 'bonus_atributos_dexterity', system: 'system.bonus.atributos.destreza' },
            STAMINA: { id: 'bonus_atributos_stamina', system: 'system.bonus.atributos.vigor' },
            PERCEPTION: { id: 'bonus_atributos_perception', system: 'system.bonus.atributos.percepcao' },
            CHARISMA: { id: 'bonus_atributos_charisma', system: 'system.bonus.atributos.carisma' },
            INTELLIGENCE: { id: 'bonus_atributos_intelligence', system: 'system.bonus.atributos.inteligencia' },
        },
        VIRTUES: {
            id: 'bonus_virtudes',
            system: 'system.bonus.virtudes',
            CONSCIOUSNESS: { id: 'bonus_consciencia', system: 'system.bonus.virtudes.consciencia' },
            PERSEVERANCE: { id: 'bonus_perseveranca', system: 'system.bonus.virtudes.perseveranca' },
            QUIETNESS: { id: 'bonus_quietude', system: 'system.bonus.virtudes.quietude' },
        },
        ABILITY: {
            id: 'bonus_habilidades',
            system: 'system.bonus.habilidades',
        },
        PM: { id: 'bonus_pm', system: 'system.bonus.movimento' },
        INITIATIVE: { id: 'bonus_iniciativa', system: 'system.bonus.iniciativa' },
        VITALITY: { id: 'bonus_vitalidade', system: 'system.bonus.vitalidade' },
        DAMAGE_PENALTY: { id: 'bonus_penalidade_dano', system: 'system.bonus.penalidade_dano' },
        DAMAGE_PENALTY_FLAT: { id: 'bonus_penalidade_dano_fixo', system: 'system.bonus.penalidade_dano_fixa' },
        OFENSIVE_MELEE: { id: 'bonus_ofensivo_corpo_a_corpo', system: 'system.bonus.ofensivo_corpo_a_corpo' },
        OFENSIVE_PROJECTILE: { id: 'bonus_ofensivo_longo_alcance', system: 'system.bonus.ofensivo_longo_alcance' },
        DEFENSIVE_FACTOR: { id: 'bonus_defensivo_multiplo', system: 'system.bonus.defensivo_multiplo' },
        DEFENSIVE: { id: 'bonus_defensivo', system: 'system.bonus.defensivo' },
    },
    ALLIES: {
        id: 'aliados',
        system: 'system.aliados',
    },
    INFORMANTS: {
        id: 'informantes',
        system: 'system.informantes',
    },
    SHORTCUTS: {
        id: 'atalhos',
        system: 'system.atalhos',
    },
    EXPERIENCE: {
        id: 'experiencia',
        system: 'system.experiencia',
        CURRENT: {
            id: 'experiencia_atual',
            system: 'system.experiencia.atual',
        },
        USED: {
            id: 'experiencia_usada',
            system: 'system.experiencia.usada',
        }
    },
    SIMPLE: { id: '', system: 'system' },
});

export const NpcCharacteristicType = Object.freeze({
    QUALITY: {
        id: 'qualidade',
        system: 'system.qualidade',
    },
    SKILLS: {
        id: 'habilidades',
        system: 'system.habilidades',
        VALUE: { id: 'valor' },
        SKILL_NAME: { id: 'nome' },
        PRIMARY: {
            id: 'primaria',
            system: 'system.habilidades.primaria',
            VALUE: { system: 'system.habilidades.primaria.valor' },
            SKILL_NAME: { system: 'system.habilidades.primaria.nome' },
        },
        SECONDARY: {
            id: 'secundaria',
            system: 'system.habilidades.secundaria',
            VALUE: { system: 'system.habilidades.secundaria.valor' },
            SKILL_NAME: { system: 'system.habilidades.secundaria.nome' },
        },
        TERTIARY: {
            id: 'terciaria',
            system: 'system.habilidades.terciaria',
            VALUE: { system: 'system.habilidades.terciaria.valor' },
            SKILL_NAME: { system: 'system.habilidades.terciaria.nome' },
        },
        QUATERNARY: {
            id: 'quaternaria',
            system: 'system.habilidades.quaternaria',
            VALUE: { system: 'system.habilidades.quaternaria.valor' },
            SKILL_NAME: { system: 'system.habilidades.quaternaria.nome' },
        },
    }
});

export const CharacteristicTypeMap = Object.freeze(Object.fromEntries(
    Object.entries(CharacteristicType).map(([key, value]) => [value.id, value.system])
));

export const NpcSkillsMap = Object.freeze(
    {
        [NpcCharacteristicType.SKILLS.PRIMARY.id]: NpcCharacteristicType.SKILLS.PRIMARY,
        [NpcCharacteristicType.SKILLS.SECONDARY.id]: NpcCharacteristicType.SKILLS.SECONDARY,
        [NpcCharacteristicType.SKILLS.TERTIARY.id]: NpcCharacteristicType.SKILLS.TERTIARY,
        [NpcCharacteristicType.SKILLS.QUATERNARY.id]: NpcCharacteristicType.SKILLS.QUATERNARY,
    }
);