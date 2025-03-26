import { createDataModels } from "./module/data/actor-data-model.mjs";
import { htmlTemplateRegister } from "./module/base/sheet/html-template.mjs";
import { loadHandlebarsHelpers } from "./scripts/utils/loadHelpers.mjs";

Hooks.once('init', async function () {
  console.log('Setor 0 - O Submundo | Inicializando sistema');
  //CONFIG.debug.hooks = true;

  createDataModels();
  configureSheetModels();
  await loadHandlebarsHelpers();
  await addListenersOnDOM();
  await configureTemplates();
});

function configureSheetModels() {
  Actors.unregisterSheet("core", ActorSheet);
  htmlTemplateRegister();
}

async function addListenersOnDOM() {
  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('toggle-tooltip')) {
      console.log(event)
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

async function configureTemplates() {
  await loadTemplates([
    "actors/characteristics",
    "actors/biography",
    "actors/status",
  ].map(item => `systems/setor0OSubmundo/templates/${item}.hbs`));
}