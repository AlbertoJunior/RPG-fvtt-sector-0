export class TraitMessageCreator {
    static async mountContent(params) {
        const data = {
            ...params,
        };
        return await renderTemplate("systems/setor0OSubmundo/templates/messages/trait.hbs", data);
    }
}