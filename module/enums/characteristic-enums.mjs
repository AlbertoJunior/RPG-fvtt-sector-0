export const CharacteristicType = Object.freeze({
    NAME: { id: 'name', system: 'system.name' },
    MORPHOLOGY: { id: 'morphology', system: 'system.morfologia' },
    CORE: { id: 'core', system: 'system.nucleo' },
    OVERLOAD: { id: 'overload', system: 'system.sobrecarga' },
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
            id: 'virtudes_consciencia',
            system: 'system.virtudes.consciencia',
            LEVEL: { id: 'consciencia_level', system: 'system.virtudes.consciencia.level' },
            USED: { id: 'consciencia_usada', system: 'system.virtudes.consciencia.used' },
        },
        PERSEVERANCE: {
            id: 'virtudes_perseveranca',
            system: 'system.virtudes.perseveranca',
            LEVEL: { id: 'perseveranca_level', system: 'system.virtudes.perseveranca.level' },
            USED: { id: 'perseveranca_usada', system: 'system.virtudes.perseveranca.used' },
        },
        QUIETNESS: {
            id: 'virtudes_consciencia',
            system: 'system.virtudes.consciencia',
            LEVEL: { id: 'consciencia_level', system: 'system.virtudes.consciencia.level' },
            USED: { id: 'consciencia_usada', system: 'system.virtudes.consciencia.used' },
        },
    },
    REPERTORY: { id: 'repertorio', system: 'system.repertorio' },
    ABILITY: {
        id: 'habilidades',
        system: 'system.habilidades',
        MELEE: { id: 'armas_brancas', system: 'system.habilidades.armas_brancas' },
        PROJECTILE: { id: 'armas_de_projecao', system: 'system.habilidades.armas_de_projecao' },
        BRAWL: { id: 'briga', system: 'system.habilidades.briga' },
        STREETWISE: { id: 'manha', system: 'system.habilidades.manha' },
        ATHLETICS: { id: 'atletismo', system: 'system.habilidades.atletismo' },
    },
    LANGUAGE: { id: 'linguas', system: 'system.linguas' },
    TRAIT: { id: 'tracos', system: 'system.tracos' },
    ENHANCEMENT_ALL: { id: 'enhancement_all', system: 'system.aprimoramentos' },
    ENHANCEMENT: { id: 'enhancement', system: 'system.aprimoramentos.aprimoramento' },
    VITALITY: {
        id: 'vitalidade',
        system: 'system.vitalidade',
        TOTAL: { id: 'vitalidade_total', system: 'system.vitalidade.total' },
        SUPERFICIAL_DAMAGE: { id: 'vitalidade_dano_superficial', system: 'system.vitalidade.dano_superficial' },
        LETAL_DAMAGE: { id: 'vitalidade_dano_letal', system: 'system.vitalidade.dano_letal' },
    },
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
        ABILITY: {
            id: 'bonus_habilidades',
            system: 'system.bonus.habilidades',
        },
        PM: { id: 'bonus_pm', system: 'system.bonus.movimento' },
        INITIATIVE: { id: 'bonus_initiative', system: 'system.bonus.iniciativa' },
        VITALITY: { id: 'bonus_vitality', system: 'system.bonus.vitalidade' },
        DAMAGE_PENALTY: { id: 'bonus_damage_penalty', system: 'system.bonus.penalidade_dano' },
        OFENSIVE_MELEE: { id: 'bonus_ofensivo_corpo_a_corpo', system: 'system.bonus.ofensivo_corpo_a_corpo' },
        OFENSIVE_PROJECTILE: { id: 'bonus_ofensivo_longo_alcance', system: 'system.bonus.ofensivo_longo_alcance' },
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

export const CharacteristicTypeMap = Object.fromEntries(
    Object.entries(CharacteristicType).map(([key, value]) => [value.id, value.system])
);