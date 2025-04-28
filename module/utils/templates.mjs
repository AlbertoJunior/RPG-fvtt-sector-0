import { actorHtmlTemplateRegister } from "../base/sheet/actor/actor-sheet-template.mjs";
import { itemsHtmlTemplateRegister } from "../base/sheet/equipment/equipment-sheet.mjs";

export async function registerTemplates() {
    const templates = [
        { model: 'Actor', method: actorHtmlTemplateRegister() },
        { model: 'Items', method: itemsHtmlTemplateRegister() },
    ];

    const results = await Promise.all(templates.map(async (template) => {
        try {
            await template.method;
            return { Template: template.model, Status: "Sucesso" };
        } catch (error) {
            console.error(error);
            return { Template: template.model, Status: "Falha" };
        }
    }));

    console.log('-> Todos os templates foram registados!');
    console.table(results);
}