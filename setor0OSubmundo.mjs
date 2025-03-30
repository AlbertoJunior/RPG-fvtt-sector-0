import { createActorDataModels } from "./module/data/actor-data-model.mjs";
import { createTraitDataModels } from "./module/data/trait-data-model.mjs";
import { actorHtmlTemplateRegister } from "./module/base/sheet/html-template.mjs";
import { loadHandlebarsHelpers } from "./scripts/utils/handlerbars-helper.mjs";

Hooks.once('init', async function () {
  console.log('-> Setor 0 - O Submundo | Inicializando sistema');
  //CONFIG.debug.hooks = true;

  createDataModels();
  actorHtmlTemplateRegister();
  await loadHandlebarsHelpers();
  await addListenersOnDOM();
});

function createDataModels() {
  createActorDataModels();
  createTraitDataModels();
}

Hooks.on('createItem', (item) => {
  if (item.pack != undefined && item.pack !== "") {
    const pack = game.packs.get(item.pack);
    if (pack && pack.metadata.flags.filter?.type) {
      const packFilter = pack.metadata.flags.filter.type;
      if (packFilter && item.type !== packFilter) {
        ui.notifications.warn(`Este pacote só aceita itens do tipo '${packFilter}'.`);
        item.delete();
      }
    }
  }
});

async function addListenersOnDOM() {
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('toggle-tooltip')) {
      let tooltip = event.target.previousElementSibling;
      let hooks = 0;
      while (hooks < 5 && tooltip) {
        if (tooltip.classList.contains('tooltip-part')) {
          tooltip.classList.toggle('hidden');
          return;
        } else {
          tooltip = tooltip.previousElementSibling;
          hooks++;
        }
      }
    }
  });
}