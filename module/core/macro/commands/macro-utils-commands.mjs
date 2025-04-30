export const verifyAndReturnActor = `
const actor = selectedToken.actor;
if(!actor?.sheet.canRollOrEdit) {
  ui.notifications.warn("Sem permissão para esse personagem.");
  return;
}
`

export const verifyAndReturnSelectedToken = `
const selectedToken = canvas.tokens.controlled[0];
if (!selectedToken) {
  ui.notifications.warn("Selecione um token primeiro.");
  return;
}
`