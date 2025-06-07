export class ChatCreator {

    static async _sendToChat(actor, content, mode) {
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            content: content,
            style: CONST.CHAT_MESSAGE_STYLES.OTHER,
            whisper: this.#configureWhisperByMode(mode),
            blind: this.#configureBlindByMode(mode)
        });
    }

    static async _sendToChatTypeRoll(actor, content, rolls = [], mode) {
        const messageData = {
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            content: content,
            rolls: rolls,
            whisper: this.#configureWhisperByMode(mode),
            blind: this.#configureBlindByMode(mode)
        };
        await ChatMessage.create(messageData, { rollMode: mode });
    }

    static #configureWhisperByMode(mode) {
        switch (mode) {
            case CONST.DICE_ROLL_MODES.PRIVATE:
                return new Set([...ChatMessage.getWhisperRecipients("GM").map(u => u.id), game.user.id]);
            case CONST.DICE_ROLL_MODES.BLIND:
                return new Set(ChatMessage.getWhisperRecipients("GM").map(u => u.id));
            case CONST.DICE_ROLL_MODES.SELF:
                return [game.user.id];
            default:
                return [];
        }
    }

    static #configureBlindByMode(mode) {
        switch (mode) {
            case CONST.DICE_ROLL_MODES.PRIVATE:
                return true;
            case CONST.DICE_ROLL_MODES.BLIND:
                return true;
            case CONST.DICE_ROLL_MODES.SELF:
                return false;
            default:
                return false;
        }
    }

}