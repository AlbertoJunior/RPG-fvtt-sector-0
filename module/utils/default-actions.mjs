import { ChatCreator } from "../../scripts/creators/chat-creator.mjs";
import { CombatUtils } from "../core/combat/combat.mjs";
import { RollInitiative } from "../core/rolls/initiative-roll.mjs";
import { RollOverload } from "../core/rolls/overload-roll.mjs";
import { RollInitiativeMessageCreator } from "../creators/message/initiative-roll.mjs";
import { RollOverloadMessageCreator } from "../creators/message/overload-roll.mjs";

export class DefaultActions {
    static async processInitiativeRoll(actor) {
        const resultRoll = await RollInitiative.roll(actor);
        const contentMessage = await RollInitiativeMessageCreator.mountContent(resultRoll);
        await ChatCreator._sendToChatTypeRoll(actor, contentMessage, [resultRoll.roll]);
        await CombatUtils.addOrUpdateActorOnCombat(actor, resultRoll.total);
    }

    static async processOverloadRoll(actor) {
        const resultRoll = await RollOverload.roll(actor);
        const contentMessage = await RollOverloadMessageCreator.mountContent(resultRoll);
        ChatCreator._sendToChatTypeRoll(actor, contentMessage, [resultRoll.roll]);
    }
}