export class ChatCreator {

    static async _sendToChat(actor, content) {
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            content: content,
            style: CONST.CHAT_MESSAGE_STYLES.OTHER
        });
    }

    static async _sendToChatTypeRoll(actor, content, rolls) {
        const message = await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            content: content,
            rolls: rolls
        });
        return message;
    }

}