import { InitHookHandle } from "./module/hooks/init.mjs";
import { ReadyHookHandle } from "./module/hooks/ready.mjs";
import { CreateItemHookHandle } from "./module/hooks/create-item.mjs";
import { CreateCombatHookHandle } from "./module/hooks/create-combat.mjs";

document.getElementById('logo').src = "systems/setor0OSubmundo/imgs/logo.png"

Hooks.once('init', async function () {
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