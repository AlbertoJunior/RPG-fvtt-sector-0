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
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            content: content,
            rolls: rolls,
            whisper: this.#configureWhisperByMode(mode),
            blind: this.#configureBlindByMode(mode)
        });
    }

    static #configureWhisperByMode(mode) {
        switch (mode) {
            case "gmroll":
                return [...ChatMessage.getWhisperRecipients("GM").map(u => u.id), game.user.id];
            case "blindroll":
                return ChatMessage.getWhisperRecipients("GM").map(u => u.id);
            case "selfroll":
                return [game.user.id];
            default:
                return [];
        }
    }

    static #configureBlindByMode(mode) {
        switch (mode) {
            case "gmroll":
                return true;
            case "blindroll":
                return true;
            case "selfroll":
                return false;
            default:
                return false;
        }
    }

}