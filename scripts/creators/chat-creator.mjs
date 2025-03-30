export class ChatCreator {

    static async _sendToChat(actor, content) {
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            content: content
        });
    }

}