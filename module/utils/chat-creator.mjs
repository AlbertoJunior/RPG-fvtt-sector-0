export class ChatCreator {

    static async _sendToChat(actor, content) {
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            content: content,
            style: CONST.CHAT_MESSAGE_STYLES.OTHER
        });
    }

    static async _sendToChatTypeRoll(actor, content, rolls = [], mode) {
        const message = await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            content: content,
            rolls: rolls
        });

        this.#configureMode(message, mode);

        return message;
    }

    static #configureMode(message, mode) {
        switch (mode) {
            case "gmroll":
                message.whisper = ChatMessage.getWhisperRecipients("GM").map(u => u.id);
                break;
            case "blindroll":
                message.whisper = ChatMessage.getWhisperRecipients("GM").map(u => u.id);
                message.blind = true;
                break;
            case "selfroll":
                message.whisper = [game.user.id];
                break;
            default:
                message.blind = false;
                message.whisper = [];
                break;
        }
    }

}