import { InitHookHandle } from "./module/hooks/init.mjs";
import { ReadyHookHandle } from "./module/hooks/ready.mjs";
import { CreateItemHookHandle } from "./module/hooks/create-item.mjs";
import { CreateCombatHookHandle } from "./module/hooks/create-combat.mjs";
import { LOGO_PATH } from "./module/constants.mjs";
import { UpdateActorHookHandle } from "./module/hooks/update-actor.mjs";

Hooks.once('init', async function () {
  document.getElementById('logo').src = LOGO_PATH
  await InitHookHandle.handle();
});

Hooks.once('ready', async () => {
  await ReadyHookHandle.handle();
});

Hooks.on('createItem', (item) => {
  CreateItemHookHandle.handle(item);
});

Hooks.on('createCombat', (combat) => {
  CreateCombatHookHandle.handle(combat);
});

Hooks.on("updateActor", (updatedActor, changes, options, userId) => {
  UpdateActorHookHandle.handle(updatedActor, changes, options, userId);
});