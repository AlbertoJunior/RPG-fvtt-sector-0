import { createDataModels } from "./scripts/utils/models.mjs";
import { loadPackages } from "./scripts/utils/repositories.mjs";
import { loadHandlebarsHelpers } from "./scripts/utils/handlerbars-helper.mjs";
import { registerTemplates } from "./scripts/utils/templates.mjs";
import { NotificationsUtils } from "./module/creators/message/notifications.mjs";
import { GameSettingsUtils } from "./module/settings/game-settings.mjs";
import { MessageRepository } from "./scripts/repository/message-repository.mjs";
import { Setor0Combat } from "./module/core/combat/combat.mjs";

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

function addListenersOnDOM() {
  document.body.addEventListener('click', (event) => {
    const target = event.target;
    const eventData = target.dataset;

    if (!eventData)
      return;

    if (!eventData.action || eventData.action == '')
      return;

    if (eventData.action == 'toggle-tooltip') {
      toggleTooltip(target);
    } else if (eventData.action == 'roll') {
      if (eventData.type == 'perseverance') {
        const messageId = target.parentElement.parentElement.parentElement.parentElement.dataset.messageId;
        console.log(MessageRepository.findMessage(messageId));
      }
    }
  });
}

function toggleTooltip(target) {
  let tooltip = target.previousElementSibling;
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