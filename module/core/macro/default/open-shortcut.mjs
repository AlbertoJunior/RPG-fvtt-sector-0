import { SYSTEM_ID } from "../../../constants.mjs";
import { verifyAndReturnActor, verifyAndReturnSelectedToken } from "../commands/macro-utils-commands.mjs";

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

${verifyAndReturnSelectedToken}

${verifyAndReturnActor}

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