import { ActorRollDialog } from "../../../scripts/creators/dialogs/actor-roll-dialog.mjs";
import { ElementCreatorJQuery } from "../../../scripts/creators/jquery/element-creator.mjs";
import { EnhancementRepository } from "../../../scripts/repository/enhancement-repository.mjs";
import { LanguageRepository } from "../../../scripts/repository/language-repository.mjs";
import { selectCharacteristic } from "../../../scripts/utils/utils.mjs";
import { CharacteristicType, CharacteristicTypeMap, OnEventType } from "../../enums/characteristic-enums.mjs";
import { handleStatusMethods } from "./status-methods.mjs";
import { traitMethods } from "./trait-methods.mjs";

export class SheetMethods {
    static characteristicTypeMap = CharacteristicTypeMap;

    static handleMethods = {
        language: {
            add: async (actor, event) => {
                const element = event.target;
                selectCharacteristic(element);

                const characteristicType = event.currentTarget.dataset.characteristic;
                const systemCharacteristic = SheetMethods.characteristicTypeMap[characteristicType];

                if (systemCharacteristic) {
                    const parentElement = element.parentElement;
                    const checked = Array.from(parentElement.children).some(el => el.classList.contains('S0-selected'));

                    const updatedLanguages = actor.system.linguas;
                    if (checked) {
                        updatedLanguages.push(parentElement.id);
                    } else {
                        const indexToRemove = updatedLanguages.indexOf(parentElement.id);
                        if (indexToRemove !== -1) {
                            updatedLanguages.splice(indexToRemove, 1);
                        }
                    }

                    const characteristic = {
                        [`${systemCharacteristic}`]: [... new Set(updatedLanguages)]
                    };

                    await actor.update(characteristic);
                }
            }
        },
        trait: traitMethods,
        effects: {
            remove: async (actor, event) => {
                const currentTarget = event.currentTarget;
                const removeType = currentTarget.dataset.type;
                if (removeType == 'single') {
                    const index = currentTarget.dataset.itemIndex;
                    const effect = Array.from(actor.effects.values())[index];
                    await effect.delete();
                } else if (removeType == 'all') {
                    const effects = actor.effects;
                    for (const effect of effects) {
                        await effect.delete();
                    }
                }
            },
            check: async (actor, event) => {
                const effects = actor.effects;
                for (const effect of effects) {
                    const effectDuration = effect.duration.type
                    if (effectDuration !== 'none') {
                        effect.delete();
                    }
                }
            },
            view: async (actor, event) => {
                $(event.currentTarget.parentElement.nextElementSibling).find('ul')[0]?.classList.toggle('hidden')
            }
        },
        temporary: handleStatusMethods
    }

    static _createDynamicSheet(html, isEditable) {
        SheetMethods.#createAttributes(html, isEditable);
        SheetMethods.#createRepertory(html, isEditable);
        SheetMethods.#createVirtues(html, isEditable);
        SheetMethods.#createAbilities(html, isEditable);
        SheetMethods.#createFame(html, isEditable);
        SheetMethods.#createLanguages(html, isEditable);
        SheetMethods.#createEnhancements(html, isEditable);
    }

    static #createAttributes(html, isEditable) {
        const characteristics = [
            { id: 'forca', label: 'S0.Forca' },
            { id: 'destreza', label: 'S0.Destreza' },
            { id: 'vigor', label: 'S0.Vigor' },
            { id: 'percepcao', label: 'S0.Percepcao' },
            { id: 'carisma', label: 'S0.Carisma' },
            { id: 'inteligencia', label: 'S0.Inteligencia' }
        ];

        const container = html.find('#atributosContainer');
        this.#create(container, characteristics, CharacteristicType.ATTRIBUTE.id, 5, isEditable, true, true);
    }

    static #createRepertory(html, isEditable) {
        const characteristics = [
            { id: 'aliados', label: 'S0.Aliados' },
            { id: 'arsenal', label: 'S0.Arsenal' },
            { id: 'informantes', label: 'S0.Informantes' },
            { id: 'recursos', label: 'S0.Recursos' },
            { id: 'superequipamentos', label: 'S0.SuperEquipamentos' }
        ];

        const container = html.find('#repertorioContainer');
        this.#create(container, characteristics, CharacteristicType.REPERTORY.id, 5, isEditable, false, false);
    }

    static #createVirtues(html, isEditable) {
        const characteristics = [
            { id: 'consciencia', label: 'S0.Consciencia' },
            { id: 'perseveranca', label: 'S0.Perseveranca' },
            { id: 'quietude', label: 'S0.Quietude' }
        ];
        const container = html.find('#virtudesContainer');
        this.#create(container, characteristics, CharacteristicType.VIRTUES.id, 5, isEditable, false, true);
    }

    static #createAbilities(html, isEditable) {
        const characteristics = [
            { id: 'armas_brancas', label: 'S0.Armas_Brancas' },
            { id: 'armas_de_projecao', label: 'S0.Armas_De_Projecao' },
            { id: 'atletismo', label: 'S0.Atletismo' },
            { id: 'briga', label: 'S0.Briga' },
            { id: 'engenharia', label: 'S0.Engenharia' },
            { id: 'expressao', label: 'S0.Expressao' },
            { id: 'furtividade', label: 'S0.Furtividade' },
            { id: 'hacking', label: 'S0.Hacking' },
            { id: 'investigacao', label: 'S0.Investigacao' },
            { id: 'medicina', label: 'S0.Medicina' },
            { id: 'manha', label: 'S0.Manha' },
            { id: 'performance', label: 'S0.Performance' },
            { id: 'pilotagem', label: 'S0.Pilotagem' },
            { id: 'quimica', label: 'S0.Quimica' },
        ];
        const container = html.find('#habilidadesContainer');
        this.#create(container, characteristics, CharacteristicType.ABILITY.id, 5, isEditable, true, false);
    }

    static #createFame(html, isEditable) {
        const container = html.find('#famaContainer');

        [
            { id: 'nucleo', label: 'S0.Nucleo', amount: 4, addLast: true, firstSelected: true },
            { id: 'influencia', label: 'S0.Influencia', amount: 5, addLast: false, firstSelected: false },
            { id: 'nivel_de_procurado', label: 'S0.Procurado', amount: 5, addLast: false, firstSelected: false },
        ].forEach(char => {
            const element = ElementCreatorJQuery._createCharacteristicContainer(
                char, CharacteristicType.SIMPLE.id, char.amount, isEditable, char.addLast, char.firstSelected
            );
            container.append(element);
        });
    }

    static #createLanguages(html, isEditable) {
        const container = html.find('#linguasContainer');
        const languages = LanguageRepository._getItems();

        languages.forEach(lang => {
            const element = ElementCreatorJQuery._createCharacteristicContainer(
                lang, CharacteristicType.LANGUAGE.id, 1, isEditable, false, lang.checked || false, OnEventType.ADD
            );
            container.append(element);
        });
    }

    static #createEnhancements(html, isEditable) {
        const container = html.find('.S0-enhancement select');
        const filteredElements = container.filter((index, element) => element.dataset.type === 'enhancement');
        const enhancements = EnhancementRepository._getItems();

        filteredElements.each((index, selectEnhancement) => {
            $(selectEnhancement).append(ElementCreatorJQuery._createOption(undefined, '', ''));

            const options = enhancements.map(enhance =>
                ElementCreatorJQuery._createOption(enhance.id, enhance.name, enhance.value)
            );
            $(selectEnhancement).append(options);
        });
    }

    static #create(container, characteristics, type, amount, isEditable, addLast, firstSelected) {
        characteristics.forEach(characteristic => {
            const element = ElementCreatorJQuery._createCharacteristicContainer(
                characteristic, type, amount, isEditable, addLast, firstSelected
            );
            container.append(element);
        });
    }

    static async _openRollDialog(actor) {
        ActorRollDialog._open(actor);
    }
}