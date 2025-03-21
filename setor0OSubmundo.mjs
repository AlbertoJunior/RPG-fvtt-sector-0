import { createDataModels } from "./module/actor-data-model.mjs";
import { htmlTemplateRegister } from "./module/base/sheet/html-template.mjs";
import { loadHandlebarsHelpers } from "./scripts/helpers/loadHelpers.mjs";

Hooks.once('init', async function () {
  console.log('Setor 0 - O Submundo | Inicializando sistema');
  //CONFIG.debug.hooks = true;

  createDataModels();
  configureSheetModels();
  await loadHandlebarsHelpers();
});

function configureSheetModels() {
  Actors.unregisterSheet("core", ActorSheet);
  htmlTemplateRegister();
}