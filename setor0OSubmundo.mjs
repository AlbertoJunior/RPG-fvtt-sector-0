import { InitHookHandle } from "./module/hooks/init.mjs";
import { ReadyHookHandle } from "./module/hooks/ready.mjs";
import { CreateItemHookHandle } from "./module/hooks/create-item.mjs";
import { CreateCombatHookHandle } from "./module/hooks/create-combat.mjs";
import { ActiveEffectHookHandle } from "./module/hooks/active-effects.mjs";

Hooks.once('init', async function () {
  await InitHookHandle.handle();
  ActiveEffectHookHandle.register();
});

Hooks.on('ready', async () => {
  await ReadyHookHandle.handle();
});

Hooks.on('createItem', (item) => {
  CreateItemHookHandle.handle(item);
});

Hooks.on('createCombat', (combat) => {
  CreateCombatHookHandle.handle(combat);
});