import { ChatCreator } from "./chat-creator.mjs";
import { ActorUtils } from "../core/actor/actor-utils.mjs";
import { CombatUtils } from "../core/combat/combat-utils.mjs";
import { RollInitiative } from "../core/rolls/initiative-roll.mjs";
import { RollLife } from "../core/rolls/life-roll.mjs";
import { RollOverload } from "../core/rolls/overload-roll.mjs";
import { RollInitiativeMessageCreator } from "../creators/message/initiative-roll.mjs";
import { RollLifeMessageCreator } from "../creators/message/life-roll.mjs";
import { RollOverloadMessageCreator } from "../creators/message/overload-roll.mjs";
import { RollMessageCreator } from "../creators/message/roll-mesage.mjs";
import { RollVirtueMessageCreator } from "../creators/message/virtue-roll.mjs";

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

    static async processLifeRoll(actor) {
        const resultRoll = await RollLife.roll(actor);
        const contentMessage = await RollLifeMessageCreator.mountContent(resultRoll);
        ChatCreator._sendToChatTypeRoll(actor, contentMessage, [resultRoll.roll]);
    }

    static async processVirtueRoll(actor, resultRoll, difficulty, mode) {
        const contentMessage = await RollVirtueMessageCreator.mountContent({ resultRoll, difficulty });
        ChatCreator._sendToChatTypeRoll(actor, contentMessage, [resultRoll.roll.roll], mode);
    }

    static async processCustomRoll(actor, resultRoll, inputParams, rollMessage, mode) {
        const params = {
            rolls: resultRoll.roll,
            attrs: resultRoll.attrs,
            modifiers: {
                ...resultRoll.modifiers,
                automatic: inputParams.automatic,
            },
            difficulty: inputParams.difficulty,
            critic: inputParams.critic,
            messageTest: rollMessage,
            havePerseverance: ActorUtils.havePerseverance(actor),
            half: inputParams.half
        }

        const rolls = [];

        const defaultRoll = params.rolls.default.roll;
        if (defaultRoll != undefined) {
            const objectRoll = this.#mountOptions(defaultRoll, { ...params, isOverload: false, isCustom: true });
            rolls.push(objectRoll);
        }

        const overloadRoll = params.rolls.overload.roll;
        if (overloadRoll != undefined) {
            const objectRoll = this.#mountOptions(overloadRoll, { ...params, isOverload: true, isCustom: true });
            rolls.push(objectRoll);
        }

        const message = await RollMessageCreator.mountContentCustomRoll(params);
        await ChatCreator._sendToChatTypeRoll(actor, message, rolls, mode);
    }

    static async sendRollOnChat(actor, resultRoll, difficulty, critic, rollMessage, mode) {
        const params = {
            rolls: resultRoll.roll,
            attrs: resultRoll.attrs,
            abilityInfo: resultRoll.abilityInfo,
            modifiers: resultRoll.modifiers,
            difficulty: Number(difficulty),
            critic: Number(critic),
            messageTest: rollMessage,
            havePerseverance: ActorUtils.havePerseverance(actor),
        }

        const rolls = [];

        const defaultRoll = params.rolls.default.roll;
        if (defaultRoll != undefined) {
            const objectRoll = this.#mountOptions(defaultRoll, { ...params, isOverload: false });
            rolls.push(objectRoll);
        }

        const overloadRoll = params.rolls.overload.roll;
        if (overloadRoll != undefined) {
            const objectRoll = this.#mountOptions(overloadRoll, { ...params, isOverload: true });
            rolls.push(objectRoll);
        }

        const message = await RollMessageCreator.mountContent(params);
        await ChatCreator._sendToChatTypeRoll(actor, message, rolls, mode);
    }

    static #mountOptions(objectRoll, params) {
        const { isOverload, difficulty, critic, messageTest, modifiers } = params;

        const specialist = modifiers?.specialist || false;
        const isHalf = modifiers?.isHalf || false;
        const automaticSuccess = modifiers?.automatic;
        const weapon = modifiers?.weapon;

        objectRoll.options = {
            ...objectRoll.options,
            isOverload: isOverload,
            difficulty: difficulty,
            critic: critic,
            messageTest: messageTest,
            specialist: specialist,
            isHalf: isHalf,
            automatic: automaticSuccess,
            weapon: weapon,
        }
        return objectRoll;
    }
}