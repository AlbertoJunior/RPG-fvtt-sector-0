export class EnhancementRepository {
    static #agilityEffects = [
        {
            id: '1',
            name: 'Maestria',
            level: 1,
            requirement: []
        },
        {
            id: '2',
            name: 'Reflexos Rápidos',
            level: 1,
            requirement: []
        },
        {
            id: '3',
            name: 'Agilidade',
            level: 2,
            requirement: ['1', '2']
        },
        {
            id: '4',
            name: 'Disparada',
            level: 3,
            requirement: ['3']
        },
        {
            id: '5',
            name: 'Primeira Forma Defensiva',
            level: 3,
            requirement: ['3']
        },
        {
            id: '6',
            name: 'Ataque Relâmpago',
            level: 4,
            requirement: ['4', '5']
        },
        {
            id: '7',
            name: 'Segunda Forma Defensiva',
            level: 4,
            requirement: ['4', '5']
        },
        {
            id: '8',
            name: 'Fração de Segundo',
            level: 5,
            requirement: ['6', '7']
        }
    ];

    static #assimilationEffects = [
        {
            id: '9',
            name: 'Aguçar Sentidos',
            level: 1,
            requirement: []
        },
        {
            id: '10',
            name: 'Hiper-Visão Cibernética',
            level: 1,
            requirement: []
        },
        {
            id: '11',
            name: 'Simulação',
            level: 2,
            requirement: [9, 10]
        },
        {
            id: '12',
            name: 'Debug',
            level: 3,
            requirement: [11]
        },
        {
            id: '13',
            name: 'Proxy',
            level: 3,
            requirement: [11]
        },
        {
            id: '14',
            name: 'Ponto de Acesso',
            level: 4,
            requirement: [12, 13]
        },
        {
            id: '15',
            name: 'Criar Gatilhos',
            level: 4,
            requirement: [12, 13]
        },
        {
            id: '16',
            name: 'Onipresença',
            level: 5,
            requirement: [14, 15]
        },
        {
            id: '17',
            name: 'Dedução e Indução Mental',
            level: 5,
            requirement: [14, 15]
        },
    ];

    static #brutalityEffects = [
        {
            id: '18',
            name: 'Força Brutal',
            level: 1,
            requirement: []
        },
        {
            id: '19',
            name: 'Fanático',
            level: 2,
            requirement: [18]
        },
        {
            id: '20',
            name: 'Força Esmagadora',
            level: 2,
            requirement: [18]
        },
        {
            id: '21',
            name: 'Canhão',
            level: 3,
            requirement: [19, 20]
        },
        {
            id: '22',
            name: 'Fulminante',
            level: 3,
            requirement: [19, 20]
        },
        {
            id: '23',
            name: 'Hit Kill',
            level: 4,
            requirement: [21, 22]
        },
        {
            id: '24',
            name: 'Destroçar',
            level: 5,
            requirement: [23]
        },
    ];

    static #influenceEffects = [
        {
            id: '25',
            name: 'Encantar',
            level: 1,
            requirement: []
        },
        {
            id: '26',
            name: 'Apavorar',
            level: 1,
            requirement: []
        },
        {
            id: '27',
            name: 'Vício',
            level: 2,
            requirement: [25, 26]
        },
        {
            id: '28',
            name: 'Mesmerizar',
            level: 3,
            requirement: [27]
        },
        {
            id: '29',
            name: 'Esquecimento',
            level: 3,
            requirement: [27]
        },
        {
            id: '30',
            name: 'Magnetismo',
            level: 4,
            requirement: [28, 29]
        },
        {
            id: '31',
            name: 'Racionalizar',
            level: 4,
            requirement: [28, 29]
        },
        {
            id: '32',
            name: 'Divindade',
            level: 5,
            requirement: [30, 31]
        },
    ];

    static #invisibilityEffects = [
        {
            id: '33',
            name: 'Esconder',
            level: 1,
            requirement: []
        },
        {
            id: '34',
            name: 'Supressão de Ruídos',
            level: 1,
            requirement: []
        },
        {
            id: '35',
            name: 'Silenciar',
            level: 1,
            requirement: []
        },
        {
            id: '36',
            name: 'Camuflagem',
            level: 2,
            requirement: [33, 34, 35]
        },
        {
            id: '37',
            name: 'Fantasma',
            level: 3,
            requirement: [36]
        },
        {
            id: '38',
            name: 'Um na multidão',
            level: 3,
            requirement: [36]
        },
        {
            id: '39',
            name: 'Desaparecer',
            level: 4,
            requirement: [37, 38]
        },
        {
            id: '40',
            name: 'Incógnito',
            level: 5,
            requirement: [39]
        },
    ];

    static #mutationEffects = [
        {
            id: '41',
            name: 'Arma Corporal',
            level: 1,
            requirement: []
        },
        {
            id: '42',
            name: 'Fundir',
            level: 1,
            requirement: []
        },
        {
            id: '43',
            name: 'Regeneração',
            level: 2,
            requirement: [42]
        },
        {
            id: '44',
            name: 'Resistência à toxinas',
            level: 2,
            requirement: [41, 42]
        },
        {
            id: '45',
            name: 'Anatomia',
            level: 3,
            requirement: [44, 43]
        },
        {
            id: '46',
            name: 'Peçonhento',
            level: 3,
            requirement: [44]
        },
        {
            id: '47',
            name: 'Incorpóreo',
            level: 4,
            requirement: [45, 46]
        },
        {
            id: '48',
            name: 'Simbiose',
            level: 4,
            requirement: [45, 46],
            requirement_special: {
                and: [42],
                or: []
            }
        },
        {
            id: '49',
            name: 'Imortalidade',
            level: 5,
            requirement: [47, 48],
        },
    ];

    static #hardnessEffects = [
        {
            id: '50',
            name: 'Resiliência',
            level: 1,
            requirement: []
        },
        {
            id: '51',
            name: 'Dureza',
            level: 2,
            requirement: [50]
        },
        {
            id: '52',
            name: 'Pele de Aço',
            level: 3,
            requirement: [51]
        },
        {
            id: '53',
            name: 'Inquebrável',
            level: 4,
            requirement: [52]
        },
        {
            id: '54',
            name: 'Troco',
            level: 4,
            requirement: [52]
        },
        {
            id: '55',
            name: 'Proeza da Dor',
            level: 5,
            requirement: [53, 54]
        },
        {
            id: '56',
            name: 'Última Chance',
            level: 5,
            requirement: [53, 54]
        },
    ];

    static #enhancements = [
        {
            id: '1', name: 'Aceleração', value: 'aceleracao', effects: this.#agilityEffects
        },
        {
            id: '2', name: 'Assimilação', value: 'assimilacao', effects: this.#assimilationEffects
        },
        {
            id: '3', name: 'Brutalidade', value: 'brutalidade', effects: this.#brutalityEffects
        },
        {
            id: '4', name: 'Indução', value: 'inducao', effects: this.#influenceEffects
        },
        {
            id: '5', name: 'Invisibilidade', value: 'invisibilidade', effects: this.#invisibilityEffects
        },
        {
            id: '6', name: 'Mutação', value: 'mutacao', effects: this.#mutationEffects
        },
        {
            id: '7', name: 'Rigidez', value: 'rigidez', effects: this.#hardnessEffects
        },
    ];

    static async #getEnhancementFromPack() {
        const compendium = await game.packs.get('setor0OSubmundo.enhancements')?.getDocuments();
        if (compendium) {
            return compendium.map((item) => {
                const convertedItem = {
                    id: item._id,
                    name: item.name,
                    value: item.value,
                    effects: item.effects
                };
                return convertedItem;
            });
        }
        return [];
    }

    static _getSynchronized() {
        return [... this.#enhancements];
    }

    static async _getWithPacks() {
        return [... this.#enhancements, ... await this.#getEnhancementFromPack()];
    }

    static _getEnhancementById(enhancementId) {
        if (enhancementId) {
            const fetchedEnhancement = this._getSynchronized().filter(item => item.id == enhancementId)[0];
            if (fetchedEnhancement) {
                return fetchedEnhancement;
            }
        }
        return undefined;
    }

    static _getEnhancementLevelsByEnhancementId(enhancementId) {
        if (enhancementId) {
            const fetchedLevels = this._getEnhancementById(enhancementId)?.effects;
            if (fetchedLevels) {
                return [...fetchedLevels];
            }
        }
        return [];
    }

    static _getEnhancementLevelById(enhancementId, effectId) {
        if (enhancementId) {
            const fetchedEffect = this._getEnhancementById(enhancementId)?.effects.filter(ef => ef.id == effectId)[0];
            return fetchedEffect;
        }
        return undefined;
    }

}