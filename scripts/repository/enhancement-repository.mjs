import { EnhancementDuration } from "../../module/enums/enhancement-enums.mjs";
import { EnhancementEffectField } from "../../module/field/actor-enhancement-field.mjs";

export class EnhancementRepository {
    static #agilityEffects = [
        new EnhancementEffectField('1', 'Maestria', 1, EnhancementDuration.PASSIVE, [], [{ key: 'atributos.destreza', value: 5 }, { key: 'atributos.forca', value: 5 }]),
        new EnhancementEffectField('2', 'Reflexos Rápidos', 1, EnhancementDuration.PASSIVE, []),
        new EnhancementEffectField('3', 'Agilidade', 2, EnhancementDuration.SCENE, ['1', '2']),
        new EnhancementEffectField('4', 'Disparada', 3, EnhancementDuration.USE, ['3']),
        new EnhancementEffectField('5', 'Primeira Forma Defensiva', 3, EnhancementDuration.SCENE, ['3']),
        new EnhancementEffectField('6', 'Ataque Relâmpago', 4, EnhancementDuration.USE, ['4', '5']),
        new EnhancementEffectField('7', 'Segunda Forma Defensiva', 4, EnhancementDuration.SCENE, ['4', '5']),
        new EnhancementEffectField('8', 'Fração de Segundo', 5, EnhancementDuration.USE, ['6', '7'])
    ].map(effect => effect.toObject(effect));

    static #assimilationEffects = [
        new EnhancementEffectField('9', 'Aguçar Sentidos', 1, EnhancementDuration.SCENE, []),
        new EnhancementEffectField('10', 'Hiper-Visão Cibernética', 1, EnhancementDuration.SCENE, []),
        new EnhancementEffectField('11', 'Simulação', 2, EnhancementDuration.SCENE, ['9', '10']),
        new EnhancementEffectField('12', 'Debug', 3, EnhancementDuration.USE, ['11']),
        new EnhancementEffectField('13', 'Proxy', 3, EnhancementDuration.SCENE, ['11']),
        new EnhancementEffectField('14', 'Ponto de Acesso', 4, EnhancementDuration.SCENE, ['12', '13']),
        new EnhancementEffectField('15', 'Criar Gatilhos', 4, EnhancementDuration.SCENE, ['12', '13']),
        new EnhancementEffectField('16', 'Onipresença', 5, EnhancementDuration.USE, ['14', '15']),
        new EnhancementEffectField('17', 'Dedução e Indução Mental', 5, EnhancementDuration.SCENE, ['14', '15'])
    ].map(effect => effect.toObject(effect));

    static #brutalityEffects = [
        new EnhancementEffectField('18', 'Força Brutal', 1, EnhancementDuration.PASSIVE, []),
        new EnhancementEffectField('19', 'Fanático', 2, EnhancementDuration.SCENE, ['18']),
        new EnhancementEffectField('20', 'Força Esmagadora', 2, EnhancementDuration.SCENE, ['18']),
        new EnhancementEffectField('21', 'Canhão', 3, EnhancementDuration.SCENE, ['19', '20']),
        new EnhancementEffectField('22', 'Fulminante', 3, EnhancementDuration.SCENE, ['19', '20']),
        new EnhancementEffectField('23', 'Hit Kill', 4, EnhancementDuration.USE, ['21', '22']),
        new EnhancementEffectField('24', 'Destroçar', 5, EnhancementDuration.SCENE, ['23'])
    ].map(effect => effect.toObject(effect));

    static #influenceEffects = [
        new EnhancementEffectField('25', 'Encantar', 1, EnhancementDuration.PASSIVE, []),
        new EnhancementEffectField('26', 'Apavorar', 1, EnhancementDuration.PASSIVE, []),
        new EnhancementEffectField('27', 'Vício', 2, EnhancementDuration.PASSIVE, ['25', '26']),
        new EnhancementEffectField('28', 'Mesmerizar', 3, EnhancementDuration.PASSIVE, ['27']),
        new EnhancementEffectField('29', 'Esquecimento', 3, EnhancementDuration.PASSIVE, ['27']),
        new EnhancementEffectField('30', 'Magnetismo', 4, EnhancementDuration.PASSIVE, ['28', '29']),
        new EnhancementEffectField('31', 'Racionalizar', 4, EnhancementDuration.PASSIVE, ['28', '29']),
        new EnhancementEffectField('32', 'Divindade', 5, EnhancementDuration.PASSIVE, ['30', '31'])
    ].map(effect => effect.toObject(effect));

    static #invisibilityEffects = [
        new EnhancementEffectField('33', 'Esconder', 1, EnhancementDuration.PASSIVE, []),
        new EnhancementEffectField('34', 'Supressão de Ruídos', 1, EnhancementDuration.PASSIVE, []),
        new EnhancementEffectField('35', 'Silenciar', 1, EnhancementDuration.PASSIVE, []),
        new EnhancementEffectField('36', 'Camuflagem', 2, EnhancementDuration.PASSIVE, ['33', '34', '35']),
        new EnhancementEffectField('37', 'Fantasma', 3, EnhancementDuration.PASSIVE, ['36']),
        new EnhancementEffectField('38', 'Um na multidão', 3, EnhancementDuration.PASSIVE, ['36']),
        new EnhancementEffectField('39', 'Desaparecer', 4, EnhancementDuration.PASSIVE, ['37', '38']),
        new EnhancementEffectField('40', 'Incógnito', 5, EnhancementDuration.PASSIVE, ['39'])
    ].map(effect => effect.toObject(effect));

    static #mutationEffects = [
        new EnhancementEffectField('41', 'Arma Corporal', 1, EnhancementDuration.PASSIVE, []),
        new EnhancementEffectField('42', 'Fundir', 1, EnhancementDuration.PASSIVE, []),
        new EnhancementEffectField('43', 'Regeneração', 2, EnhancementDuration.PASSIVE, ['42']),
        new EnhancementEffectField('44', 'Resistência à toxinas', 2, EnhancementDuration.PASSIVE, ['41', '42']),
        new EnhancementEffectField('45', 'Anatomia', 3, EnhancementDuration.PASSIVE, ['44', '43']),
        new EnhancementEffectField('46', 'Peçonhento', 3, EnhancementDuration.PASSIVE, ['44']),
        new EnhancementEffectField('47', 'Incorpóreo', 4, EnhancementDuration.PASSIVE, ['45', '46']),
        new EnhancementEffectField('48', 'Simbiose', 4, EnhancementDuration.PASSIVE, ['45', '46']),
        new EnhancementEffectField('49', 'Imortalidade', 5, EnhancementDuration.PASSIVE, ['47', '48'])
    ].map(effect => effect.toObject(effect));

    static #hardnessEffects = [
        new EnhancementEffectField('50', 'Resiliência', 1, EnhancementDuration.PASSIVE, []),
        new EnhancementEffectField('51', 'Dureza', 2, EnhancementDuration.PASSIVE, ['50']),
        new EnhancementEffectField('52', 'Pele de Aço', 3, EnhancementDuration.PASSIVE, ['51']),
        new EnhancementEffectField('53', 'Inquebrável', 4, EnhancementDuration.PASSIVE, ['52']),
        new EnhancementEffectField('54', 'Troco', 4, EnhancementDuration.PASSIVE, ['52']),
        new EnhancementEffectField('55', 'Proeza da Dor', 5, EnhancementDuration.PASSIVE, ['53', '54']),
        new EnhancementEffectField('56', 'Última Chance', 5, EnhancementDuration.PASSIVE, ['53', '54'])
    ].map(effect => effect.toObject(effect));

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
        let fetchedItem;
        if (enhancementId && enhancementId !== '') {
            fetchedItem = this._getEnhancementById(enhancementId)?.effects.filter(ef => ef.id == effectId)[0];
        } else if (effectId && effectId !== '') {
            fetchedItem = this._getItems().map(enhancement => enhancement.effects)?.flat().filter(ef => ef.id == effectId)[0];
        }
        return fetchedItem;
    }

    static _getEnhancementFamilyByEffectId(effectId) {
        return this._getItems().find(enhancement => enhancement.effects.some(effect => effect.id == effectId));
    }

}