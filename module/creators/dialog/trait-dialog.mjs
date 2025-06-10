import { TraitRepository } from "../../repository/trait-repository.mjs";
import { ChatCreator } from "../../utils/chat-creator.mjs";
import { localize } from "../../../scripts/utils/utils.mjs";
import { DialogUtils } from "../../utils/dialog-utils.mjs";
import { TraitMessageCreator } from "../message/trait-message.mjs";
import { TEMPLATES_PATH } from "../../constants.mjs";

export class TraitDialog {
  static async open(type, callback) {
    const traits = TraitRepository.getItemsByType(type);
    const content = await this.#mountContent(traits, true, true);

    new Dialog({
      title: localize("Adicionar_Traco"),
      content: content,
      buttons: {
        cancel: {
          label: localize("Cancelar"),
          callback: (html) => { }
        },
        confirm: {
          label: localize("Adicionar"),
          callback: (html) => {
            const objectTrait = this.#mountTraitObject(html, traits);
            callback(objectTrait);
          }
        }
      },
      default: 'confirm',
      render: (html) => { this.#myRender(html, traits); }
    }).render(true);
  }

  static async openByTrait(trait, type, actor, callback) {
    const traits = TraitRepository.getItemsByType(type);
    const content = await this.#mountContent(traits, false, callback != undefined, trait);

    const dialog = new Dialog({
      title: `${callback ? `${localize('Editar')} ` : ''}${localize('Traco')}`,
      content: content,
      buttons: {
        confirm: {
          label: localize("Chat"),
          callback: async (html) => {
            const fetchedTrait = traits.find(t => t.id == trait.id);
            if (fetchedTrait) {
              const messageContent = await TraitMessageCreator.mountContent(fetchedTrait);
              ChatCreator._sendToChat(actor, messageContent);
            }
          }
        }
      },
      default: 'confirm',
      render: (html) => { this.#myRender(html, traits); }
    });

    if (callback != undefined) {
      dialog.data.buttons = {
        cancel: {
          label: localize("Cancelar"),
          callback: (html) => {
            callback(undefined);
          }
        },
        confirm: {
          label: localize("Salvar"),
          callback: (html) => {
            const objectTrait = this.#mountTraitObject(html, traits);
            callback(objectTrait);
          }
        }
      }
      dialog.data.default = 'confirm';
    }

    dialog.render(true);
  }

  static async #mountContent(traits, enableChangeTrait, enableChangeParticularity, trait) {
    const selectedTrait = traits.find(element => element.id == trait?.id);

    const data = {
      title: localize('Traco'),
      options: this.#mapOptions(traits, selectedTrait),
      isEnabledChangeTrait: enableChangeTrait ? '' : 'disabled',
      particularity: localize('Particularidade'),
      isEnabledChangeParticularity: enableChangeParticularity ? '' : 'disabled',
      particularityValue: selectedTrait?.particularity || '',
      morph: localize('Morfologia'),
      morphValue: selectedTrait?.morph || '',
      requirement: localize('Requisito'),
      requirementValue: selectedTrait?.requirement || '',
      cost: localize('Custo'),
      description: selectedTrait?.description
    };

    return await renderTemplate(`${TEMPLATES_PATH}/traits/trait-dialog.hbs`, data);
  }

  static #mapOptions(traits, selectedTrait) {
    const groups = {};

    const prefix = 'XP:';

    traits.forEach((attr, index) => {
      const groupLabel = attr.morph ? attr.morph : `${prefix} ${attr.xp}`;

      if (!groups[groupLabel]) {
        groups[groupLabel] = [];
      }

      groups[groupLabel].push({
        id: attr.id,
        isSelected: selectedTrait?.id === attr.id ? 'selected' : '',
        label: attr.name
      });
    });

    return Object.entries(groups)
      .sort(([labelA], [labelB]) => {
        const isXPA = labelA.startsWith(prefix);
        const isXPB = labelB.startsWith(prefix);

        if (isXPA && isXPB) {
          const xpA = parseInt(labelA.replace(prefix, "").trim());
          const xpB = parseInt(labelB.replace(prefix, "").trim());
          return xpA - xpB;
        }

        if (isXPA) {
          return 1;
        }

        if (isXPB) {
          return -1;
        }

        return labelA.localeCompare(labelB);
      })
      .map(([label, options]) => (
        {
          label,
          options
        }
      ));
  }

  static #mountTraitObject(html, traits) {
    const traitId = html.find('#trait').val();
    const objectTrait = this.#findTrait(traits, traitId);
    if (objectTrait.particularity != undefined) {
      const particularity = html.find('#particularity').val();
      objectTrait['particularity'] = particularity;
    }
    return objectTrait;
  }

  static #myRender(html, traits) {
    DialogUtils.presetDialogRender(html);
    html.find('#trait').on('change', (event) => {
      this.#updateValues(html, traits)
    });
    this.#updateValues(html, traits);
  }

  static #updateValues(html, traits) {
    const traitId = html.find('#trait').val();
    const selectedTrait = this.#findTrait(traits, traitId);

    const htmlElements = {
      costLabel: { element: html.find('#cost') },
      divParticularity: { element: html.find('#divParticularity'), addClass: 'hidden' },
      particularityLabel: { element: html.find('#particularity') },
      divRequirement: { element: html.find('#divRequirement'), addClass: 'hidden' },
      requirementLabel: { element: html.find('#requirement') },
      divMorph: { element: html.find('#divMorph'), addClass: 'hidden' },
      morphLabel: { element: html.find('#morph') },
      descriptionLabel: { element: html.find('#description') },
    };

    if (selectedTrait) {
      this.#toggleVisibility(selectedTrait.particularity, htmlElements.divParticularity, htmlElements.particularityLabel);
      this.#toggleVisibility(selectedTrait.requirement, htmlElements.divRequirement, htmlElements.requirementLabel, selectedTrait.requirement);
      this.#toggleVisibility(selectedTrait.morph, htmlElements.divMorph, htmlElements.morphLabel, selectedTrait.morph);

      htmlElements.costLabel.element.html(selectedTrait.xp ?? "0");
      htmlElements.descriptionLabel.element[0].innerHTML = selectedTrait.description;
    } else {
      Object.values(htmlElements).forEach(el => {
        if (el.addClass) {
          el.element.addClass(el.addClass);
        }
      });
      htmlElements.costLabel.html('0');
      htmlElements.particularityLabel.html('');
    }

    html.parent().parent().css('height', 'auto');
  }

  static #findTrait(traits, traitId) {
    return traits.find(element => element.id == traitId);
  }

  static #toggleVisibility(particularity, container, labelContainer = null, value = "") {
    const haveElement = particularity !== undefined
    const element = container.element;
    const label = labelContainer.element;

    element.toggleClass("hidden", !haveElement);
    if (label) {
      label.html(haveElement ? value : "");
    }
  }
}