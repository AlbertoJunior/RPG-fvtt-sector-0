import { SYSTEM_ID } from "../../../constants.mjs";

export const openShortcutMacroData = {
  flags: {
    [SYSTEM_ID]: {
      sourceId: '2',
      role: 'user',
    }
  },
  name: "Abrir Atalhos",
  command: `
const targetPage = 5;

const selectedToken = canvas.tokens.controlled[0];
if (!selectedToken) {
  ui.notifications.warn("Selecione um token primeiro.");
  return;
}

const actor = selectedToken.actor;
if(!actor.sheet.canRollOrEdit) {
  ui.notifications.warn("Sem permissão para ver esse personagem.");
  return;
}

actor.sheet.render(true);
setTimeout(() => {
  if (actor.sheet.currentPage !== undefined) {
    actor.sheet.currentPage = targetPage;
    actor.sheet.render(false);
  } else {
    ui.notifications.warn("Esta ficha não suporta navegação por página.");
  }
}, 50);
`,
  img: "icons/svg/book.svg",
  type: "script"
}