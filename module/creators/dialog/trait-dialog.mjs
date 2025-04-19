import { TraitRepository } from "../../repository/trait-repository.mjs";
import { ChatCreator } from "../../../scripts/creators/chat-creator.mjs";
import { localize, TODO } from "../../../scripts/utils/utils.mjs";

export class TraitDialog {
  static async _open(type, callback) {    
    const traits = TraitRepository._getItemsByType(type);
    const content = await this.#mountContent(traits, true, true);

    new Dialog({
      title: "Adicionar Traço",
      content: content,
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: (html) => { }
        },
        confirm: {
          label: "Adicionar",
          callback: (html) => {
            const objectTrait = this.#mountTraitObject(html, traits);
            callback(objectTrait);
          }
        }
      },
      render: (html) => {
        this.#myRender(html, traits);
      }
    }).render(true);
  }

  static async _openByTrait(trait, type, actor, callback) {
    const traits = TraitRepository._getItemsByType(type);
    const content = await this.#mountContent(traits, false, callback != undefined, trait);

    const dialog = new Dialog({
      title: `${callback ? 'Editar ' : ''}Traço`,
      content: content,
      buttons: {
        confirm: {
          label: "Chat",
          callback: (html) => {
            TODO("implementar lógica do content");
            ChatCreator._sendToChat(actor, content);
          }
        }
      },
      render: (html) => {
        this.#myRender(html, traits);
      }
    });

    if (callback != undefined) {
      dialog.data.buttons = {
        cancel: {
          label: "Cancelar",
          callback: (html) => {
            callback(undefined);
          }
        },
        confirm: {
          label: "Salvar",
          callback: (html) => {
            const objectTrait = this.#mountTraitObject(html, traits);
            callback(objectTrait);
          }
        }
      }
    }

    dialog.render(true);
  }

  static async #mountContent(traits, enableChangeTrait, enableChangeParticularity, trait) {
    const isEnabledChangeTrait = enableChangeTrait ? '' : 'disabled';
    const isEnabledChangeParticularity = enableChangeParticularity ? '' : 'disabled';

    const data = {
      title: localize('Traco'),
      options: this.#mapOptions(traits, trait),
      isEnabledChangeTrait: isEnabledChangeTrait,
      particularity: localize('Particularidade'),
      isEnabledChangeParticularity: isEnabledChangeParticularity,
      particularityValue: trait?.particularity || '',
      morph: localize('Morfologia'),
      morphValue: trait?.morph || '',
      requirement: localize('Requisito'),
      requirementValue: trait?.requirement || '',
      cost: localize('Custo'),
    };

    return await renderTemplate("systems/setor0OSubmundo/templates/traits/trait-dialog.hbs", data);
  }

  static #mapOptions(traits, selectedTrait) {
    const options = traits
      .map((attr, index) => {
        let isSelected = '';
        if (selectedTrait) {
          isSelected = attr.id == selectedTrait.id ? 'S0-selected' : '';
        }
        return {
          id: attr.id,
          index,
          isSelected,
          label: attr.name
        };
      });
    return options;
  }

  static #mountTraitObject(html, traits) {
    const trait = html.find('#trait').val();
    const particularity = html.find('#particularity').val();
    const objectTrait = traits[trait];
    if (objectTrait.particularity != undefined) {
      objectTrait['particularity'] = particularity;
    }
    return objectTrait;
  }

  static #myRender(html, traits) {
    function updateCost() {
      html.parent().parent().css('height', 'auto');

      const traitIndex = html.find('#trait').val();
      const selectedOption = html.find(`#trait option[value="${traitIndex}"]`);
      const dataId = selectedOption.data('id');

      const selectedTrait = traits.find(element => element.id == dataId);

      const htmlElements = {
        costLabel: { element: html.find('#cost') },
        divParticularity: { element: html.find('#divParticularity'), addClass: 'hidden' },
        particularityLabel: { element: html.find('#particularity') },
        divRequirement: { element: html.find('#divRequirement'), addClass: 'hidden' },
        requirementLabel: { element: html.find('#requirement') },
        divMorph: { element: html.find('#divMorph'), addClass: 'hidden' },
        morphLabel: { element: html.find('#morph') },
      };

      if (selectedTrait) {
        const toggleVisibility = (condition, element, label = null, value = "") => {
          element.toggleClass("hidden", !condition);
          if (label) {
            label.html(condition ? value : "");
          }
        };

        toggleVisibility(selectedTrait.particularity !== undefined, htmlElements.divParticularity.element, htmlElements.particularityLabel.element);
        toggleVisibility(selectedTrait.requirement !== undefined, htmlElements.divRequirement.element, htmlElements.requirementLabel.element, selectedTrait.requirement);
        toggleVisibility(selectedTrait.morph !== undefined, htmlElements.divMorph.element, htmlElements.morphLabel.element, selectedTrait.morph);

        htmlElements.costLabel.element.html(selectedTrait.xp ?? "0");
      } else {
        Object.values(htmlElements).forEach(el => {
          if (el.addClass) {
            el.element.addClass(el.addClass);
          }
        });
        htmlElements.costLabel.html('0');
        htmlElements.particularityLabel.html('');
      }
    }

    html.find('#trait').on('change', updateCost);
    updateCost();
  }
}