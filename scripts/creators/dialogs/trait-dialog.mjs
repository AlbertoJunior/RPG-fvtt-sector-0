import { TraitRepository } from "../../repository/trait-repository.mjs";
import { ChatCreator } from "../chat-creator.mjs";
import { localize } from "../../utils/utils.mjs";

export class TraitDialog {
  static async _open(type, callback) {
    const traits = await TraitRepository._getByType(type);
    const content = this.#mountContent(traits, true, true);

    new Dialog({
      title: "Adicionar Traço",
      content: content,
      buttons: {
        cancel: {
          label: "Cancelar",
          callback: (html) => {
            callback(undefined);
          }
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
    const traits = await TraitRepository._getByType(type);
    const content = this.#mountContent(traits, false, callback != undefined, trait);

    const dialog = new Dialog({
      title: `${callback ? 'Editar ' : ''}Traço`,
      content: content,
      buttons: {
        confirm: {
          label: "Chat",
          callback: (html) => {
            ChatCreator._sendToChat(actor, "TODO: Criar exemplo de chat para traço");
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

  static #mountContent(traits, enableChangeTrait, enableChangeParticularity, trait) {
    const options = this.#mapOptions(traits, trait);
    const isEnabledChangeTrait = enableChangeTrait ? '' : 'disabled';
    const isEnabledChangeParticularity = enableChangeParticularity ? '' : 'disabled';
    const selectField = `<select id="trait" ${isEnabledChangeTrait} >${options}</select>`;

    return `
    <form>
        <div class="form-group">
            <label for="trait" style="max-width: 110px; font-weight: bold;">${localize('Traco')}</label>
            ${selectField}
        </div>
        <div id="divParticularity">
            <hr>
            <div class="form-group">
                <label for="particularity" style="max-width: 110px; font-weight: bold;">${localize('Particularidade')}:</label>
                <input id="particularity" type="text" ${isEnabledChangeParticularity} value="${trait?.particularity || ''}"></input>
            </div>
        </div>
        <div class="form-group" id="divMorph">
            <hr>
            <label style="max-width: 110px; font-weight: bold;">${localize('Requisito')}:</label>
            <label id="morph" style="margin-inline: 5px;">${trait?.morph || ''}</label>
        </div>
        <div class="form-group" id="divRequirement">
            <hr>
            <label style="max-width: 110px; font-weight: bold;">${localize('Requisito')}:</label>
            <label id="requirement" style="margin-inline: 5px;">${trait?.requirement || ''}</label>
        </div>
        <div class="form-group">
            <hr>
            <label style="max-width: 110px; font-weight: bold;">${localize('Custo')}:</label>
            <label id="cost" style="margin-inline: 5px;"></label>
        </div>
        <hr>
    </form>
    `;
  }

  static #mapOptions(traits, selected) {
    const options = traits
      .map((attr, index) => {
        const label = attr.name;
        const dataset = `data-id="${attr.id}"`;
        let isSelected = '';
        if (selected) {
          isSelected = attr.id == selected.id ? 'selected' : '';
        }

        return `<option ${dataset} value="${index}" ${isSelected}>${label}</option>`;
      })
      .join("");
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

      const costLabel = html.find('#cost');
      const particularityLabel = html.find('#particularity');
      const divParticularity = html.find('#divParticularity');
      const divRequirement = html.find('#divRequirement');
      const divMorph = html.find('#divMorph');

      const selectedTrait = traits.find(element => element.id == dataId);
      if (selectedTrait) {
        if (selectedTrait.particularity !== undefined) {
          divParticularity.removeClass('hidden');
        } else {
          divParticularity.addClass('hidden');
          particularityLabel.html('');
        }

        if (selectedTrait.requirement !== undefined) {
          const requirementLabel = html.find('#requirement');
          requirementLabel.html(selectedTrait.requirement);
          divRequirement.removeClass('hidden');
        } else {
          divRequirement.addClass('hidden');
        }

        if (selectedTrait.morph !== undefined) {
          const morphLabel = html.find('#morph');
          morphLabel.html(selectedTrait.morph);
          divMorph.removeClass('hidden');
        } else {
          divMorph.addClass('hidden');
        }

        costLabel.html(selectedTrait.xp);
      } else {
        divParticularity.addClass('hidden');
        divRequirement.addClass('hidden');
        divMorph.addClass('hidden');
        costLabel.html(`0`);
        particularityLabel.html('');
      }
    }

    html.find('#trait').on('change', updateCost);
    updateCost();
  }
}