import { EnhancementDuration, EnhancementOverload } from "../../module/enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../module/field/actor-enhancement-field.mjs";

export class EnhancementRepository {
    static #agilityEffects = [
        EnhancementEffectField._toJson(
            '1', 'Maestria', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, [], [{ key: 'atributos.destreza', value: 5 }, { key: 'atributos.forca', value: 5 }]
        ),
        EnhancementEffectField._toJson('2', 'Reflexos Rápidos', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
        EnhancementEffectField._toJson('3', 'Agilidade', 2, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['1', '2']),
        EnhancementEffectField._toJson('4', 'Disparada', 3, EnhancementOverload.NONE, EnhancementDuration.USE, ['3']),
        EnhancementEffectField._toJson('5', 'Primeira Forma Defensiva', 3, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['3']),
        EnhancementEffectField._toJson('6', 'Ataque Relâmpago', 4, EnhancementOverload.NONE, EnhancementDuration.USE, ['4', '5']),
        EnhancementEffectField._toJson('7', 'Segunda Forma Defensiva', 4, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['4', '5']),
        EnhancementEffectField._toJson('8', 'Fração de Segundo', 5, EnhancementOverload.NONE, EnhancementDuration.USE, ['6', '7'])
    ];

    static #assimilationEffects = [
        EnhancementEffectField._toJson('9', 'Aguçar Sentidos', 1, EnhancementOverload.NONE, EnhancementDuration.SCENE, []),
        EnhancementEffectField._toJson('10', 'Hiper-Visão Cibernética', 1, EnhancementOverload.NONE, EnhancementDuration.SCENE, []),
        EnhancementEffectField._toJson('11', 'Simulação', 2, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['9', '10']),
        EnhancementEffectField._toJson('12', 'Debug', 3, EnhancementOverload.NONE, EnhancementDuration.USE, ['11']),
        EnhancementEffectField._toJson('13', 'Proxy', 3, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['11']),
        EnhancementEffectField._toJson('14', 'Ponto de Acesso', 4, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['12', '13']),
        EnhancementEffectField._toJson('15', 'Criar Gatilhos', 4, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['12', '13']),
        EnhancementEffectField._toJson('16', 'Onipresença', 5, EnhancementOverload.NONE, EnhancementDuration.USE, ['14', '15']),
        EnhancementEffectField._toJson('17', 'Dedução e Indução Mental', 5, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['14', '15'])
    ];

    static #brutalityEffects = [
        EnhancementEffectField._toJson('18', 'Força Brutal', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
        EnhancementEffectField._toJson('19', 'Fanático', 2, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['18']),
        EnhancementEffectField._toJson('20', 'Força Esmagadora', 2, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['18']),
        EnhancementEffectField._toJson('21', 'Canhão', 3, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['19', '20']),
        EnhancementEffectField._toJson('22', 'Fulminante', 3, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['19', '20']),
        EnhancementEffectField._toJson('23', 'Hit Kill', 4, EnhancementOverload.NONE, EnhancementDuration.USE, ['21', '22']),
        EnhancementEffectField._toJson('24', 'Destroçar', 5, EnhancementOverload.NONE, EnhancementDuration.SCENE, ['23'])
    ];

    static #influenceEffects = [
        EnhancementEffectField._toJson('25', 'Encantar', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
        EnhancementEffectField._toJson('26', 'Apavorar', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
        EnhancementEffectField._toJson('27', 'Vício', 2, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['25', '26']),
        EnhancementEffectField._toJson('28', 'Mesmerizar', 3, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['27']),
        EnhancementEffectField._toJson('29', 'Esquecimento', 3, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['27']),
        EnhancementEffectField._toJson('30', 'Magnetismo', 4, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['28', '29']),
        EnhancementEffectField._toJson('31', 'Racionalizar', 4, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['28', '29']),
        EnhancementEffectField._toJson('32', 'Divindade', 5, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['30', '31'])
    ];

    static #invisibilityEffects = [
        EnhancementEffectField._toJson('33', 'Esconder', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
        EnhancementEffectField._toJson('34', 'Supressão de Ruídos', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
        EnhancementEffectField._toJson('35', 'Silenciar', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
        EnhancementEffectField._toJson('36', 'Camuflagem', 2, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['33', '34', '35']),
        EnhancementEffectField._toJson('37', 'Fantasma', 3, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['36']),
        EnhancementEffectField._toJson('38', 'Um na multidão', 3, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['36']),
        EnhancementEffectField._toJson('39', 'Desaparecer', 4, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['37', '38']),
        EnhancementEffectField._toJson('40', 'Incógnito', 5, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['39'])
    ];

    static #mutationEffects = [
        EnhancementEffectField._toJson('41', 'Arma Corporal', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
        EnhancementEffectField._toJson('42', 'Fundir', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
        EnhancementEffectField._toJson('43', 'Regeneração', 2, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['42']),
        EnhancementEffectField._toJson('44', 'Resistência à toxinas', 2, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['41', '42']),
        EnhancementEffectField._toJson('45', 'Anatomia', 3, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['44', '43']),
        EnhancementEffectField._toJson('46', 'Peçonhento', 3, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['44']),
        EnhancementEffectField._toJson('47', 'Incorpóreo', 4, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['45', '46']),
        EnhancementEffectField._toJson('48', 'Simbiose', 4, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['45', '46']),
        EnhancementEffectField._toJson('49', 'Imortalidade', 5, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['47', '48'])
    ];

    static #hardnessEffects = [
        EnhancementEffectField._toJson('50', 'Resiliência', 1, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, []),
        EnhancementEffectField._toJson('51', 'Dureza', 2, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['50']),
        EnhancementEffectField._toJson('52', 'Pele de Aço', 3, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['51']),
        EnhancementEffectField._toJson('53', 'Inquebrável', 4, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['52']),
        EnhancementEffectField._toJson('54', 'Troco', 4, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['52']),
        EnhancementEffectField._toJson('55', 'Proeza da Dor', 5, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['53', '54']),
        EnhancementEffectField._toJson('56', 'Última Chance', 5, EnhancementOverload.NONE, EnhancementDuration.PASSIVE, ['53', '54'])
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

    static #loadedFromPack = [];

    static async _loadFromPack() {
        const compendium = await game.packs.get('setor0OSubmundo.enhancements')?.getDocuments();
        if (compendium) {
            EnhancementRepository.#loadedFromPack = compendium.map((item) => {
                return {
                    id: item._id,
                    name: item.name,
                    value: item.value,
                    effects: item.effects
                };
            });
        }
    }

    static _getItems() {
        return [... this.#enhancements, ... this.#loadedFromPack];
    }

    static _getEnhancementById(enhancementId) {
        if (enhancementId) {
            const a = this._getItems();
            const fetchedEnhancement = this._getItems().filter(item => item.id == enhancementId)[0];
            if (fetchedEnhancement) {
                return fetchedEnhancement;
            }
        }
        return undefined;
    }

    static _getEnhancementEffectsByEnhancementId(enhancementId) {
        if (enhancementId) {
            const fetchedLevels = this._getEnhancementById(enhancementId)?.effects;
            if (fetchedLevels) {
                return [...fetchedLevels];
            }
        }
        return [];
    }

    static _getEnhancementEffectById(effectId, enhancementId) {
        if (!effectId)
            return null;

        if (enhancementId) {
            return this._getEnhancementById(enhancementId)?.effects.find(ef => ef.id == effectId) || null;
        }

        return this._getItems()
            .flatMap(enhancement => enhancement.effects)
            .find(ef => ef.id == effectId) || null;
    }

    static _getEnhancementFamilyByEffectId(effectId) {
        return this._getItems().find(enhancement => enhancement.effects?.some(effect => effect.id == effectId));
    }

}