export class RollInitiativeMessageCreator {
    static async mountContent(params) {
        const { initiative, value, total, values } = params;
        const data = {
            initiative: initiative,
            value: value,
            total: total,
            diceValues: values,
        };
        return await renderTemplate("systems/setor0OSubmundo/templates/messages/roll-initiative.hbs", data);
    }
}