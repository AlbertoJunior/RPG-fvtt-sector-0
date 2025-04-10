import { createDataModels } from "./scripts/utils/models.mjs";
import { loadPackages } from "./scripts/utils/repositories.mjs";
import { loadHandlebarsHelpers } from "./scripts/utils/handlerbars-helper.mjs";
import { registerTemplates } from "./scripts/utils/templates.mjs";
import { NotificationsUtils } from "./module/creators/message/notifications.mjs";
import { GameSettingsUtils } from "./module/settings/game-settings.mjs";
import { Setor0Combat } from "./module/core/combat/setor0-combat.mjs";
import { addListenersOnDOM } from "./scripts/utils/dom-listeners.mjs";

Hooks.once('init', async function () {
  console.log('-> Setor 0 - O Submundo | Inicializando sistema');
  //CONFIG.debug.hooks = true;

  CONFIG.Combat.documentClass = Setor0Combat;

  addListenersOnDOM();
  await createDataModels();
  await GameSettingsUtils.loadGameSettings();
  await loadPackages();
  await loadHandlebarsHelpers();
  await registerTemplates();
});

Hooks.on('ready', async () => {
});

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


Hooks.on('createCombat', (combat) => {
  console.log(combat);
});