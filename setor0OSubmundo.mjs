import { InitHookHandle } from "./module/hooks/init.mjs";
import { ReadyHookHandle } from "./module/hooks/ready.mjs";
import { CreateItemHookHandle } from "./module/hooks/create-item.mjs";
import { CreateCombatHookHandle } from "./module/hooks/create-combat.mjs";

Hooks.once('init', async function () {
  await InitHookHandle.handle();
});

Hooks.on('ready', async () => {
  ReadyHookHandle.handle();
});

Hooks.on('createItem', (item) => {
  CreateItemHookHandle.handle(item);
});


Hooks.on('createCombat', (combat) => {
  CreateCombatHookHandle.handle(combat);
});