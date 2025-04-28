import { ICONS_PATH, SYSTEM_ID } from "../../../constants.mjs";

export const rollOverloadMacroData = {
  flags: {
    [SYSTEM_ID]: {
      sourceId: '3',
      role: 'user',
    }
  },
  name: "Teste de Sobrecarga",
  command: `
const selectedToken = canvas.tokens.controlled[0];
if (!selectedToken) {
  ui.notifications.warn("Selecione um token primeiro.");
  return;
}

const actor = selectedToken.actor;
if(!actor.sheet.canRollOrEdit) {
  ui.notifications.warn("Sem permissão para esse personagem.");
  return;
}

await globalThis.MacroMethods.overload(actor);
`,
  img: `${ICONS_PATH}/overload.svg`,
  type: "script"
}