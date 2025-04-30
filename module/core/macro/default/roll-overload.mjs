import { ICONS_PATH, SYSTEM_ID } from "../../../constants.mjs";
import { verifyAndReturnActor, verifyAndReturnSelectedToken } from "../commands/macro-utils-commands.mjs";

export const rollOverloadMacroData = {
  flags: {
    [SYSTEM_ID]: {
      sourceId: '3',
      role: 'user',
    }
  },
  name: "Teste de Sobrecarga",
  command: `
${verifyAndReturnSelectedToken}

${verifyAndReturnActor}

await globalThis.MacroMethods.overload(actor);
`,
  img: `${ICONS_PATH}/overload.svg`,
  type: "script"
}