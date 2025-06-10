import { ICONS_PATH, SYSTEM_ID } from "../../../constants.mjs";
import { verifyAndReturnActor, verifyAndReturnSelectedToken } from "../commands/macro-utils-commands.mjs";

export const seeArtWorkMacroData = {
  flags: {
    [SYSTEM_ID]: {
      sourceId: '4',
      role: 'user',
    }
  },
  name: "Ver arte do Personagem",
  ownership: {
    default: CONST.USER_ROLES.PLAYER
  },
  command: `
${verifyAndReturnSelectedToken}
${verifyAndReturnActor}
new ImagePopout(actor.img, {
  title: "Arte de ${actor.name}",
  shareable: true,
  uuid: actor.uuid
}).render(true);
`,
  img: `${ICONS_PATH}/overload.svg`,
  type: "script"
}