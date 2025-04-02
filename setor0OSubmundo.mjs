import { createDataModels } from "./scripts/utils/models.mjs";
import { loadPackages } from "./scripts/utils/repositories.mjs";
import { loadHandlebarsHelpers } from "./scripts/utils/handlerbars-helper.mjs";
import { registerTemplates } from "./scripts/utils/templates.mjs";
import { NotificationsUtils } from "./scripts/utils/notifications.mjs";

Hooks.once('init', async function () {
  console.log('-> Setor 0 - O Submundo | Inicializando sistema');
  //CONFIG.debug.hooks = true;

  addListenersOnDOM();
  await createDataModels();
  await loadPackages();
  await loadHandlebarsHelpers();
  await registerTemplates();
});

function addListenersOnDOM() {
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

Hooks.on('createItem', (item) => {
  if (item.pack != undefined && item.pack !== "") {
    const pack = game.packs.get(item.pack);
    if (pack && pack.metadata.flags.filter?.type) {
      const packFilter = pack.metadata.flags.filter.type;
      if (packFilter && item.type !== packFilter) {
        NotificationsUtils.warn(`Este pacote só aceita itens do tipo '${packFilter}'.`);
        item.delete();
      }
    }
  }
});