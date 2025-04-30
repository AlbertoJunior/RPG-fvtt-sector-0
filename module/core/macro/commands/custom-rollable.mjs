import { verifyAndReturnActor, verifyAndReturnSelectedToken } from "./macro-utils-commands.mjs";

export function createCustomRollableMacro(rollableData) {
    MacroMethods

    const command = `
${verifyAndReturnSelectedToken}

${verifyAndReturnActor}

await globalThis.MacroMethods.customs.rollable({actor, id: "${rollableData.id}"});
`
    return command;
}
