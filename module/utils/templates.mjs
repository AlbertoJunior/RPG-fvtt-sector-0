import { actorTemplatesRegister } from "../base/sheet/actor/actor-sheet-template.mjs";
import { equipmentTemplatesRegister } from "../base/sheet/equipment/equipment-sheet.mjs";
import { REGISTERED_TEMPLATES, SYSTEM_ID } from "../constants.mjs";

export async function registerTemplates() {
    const loadedAuxiliaryTemplates = await loadAuxiliaryTemplates();
    const loadedSheetTemplates = await loadSheetTemplates();

    const allTemplates = [...loadedAuxiliaryTemplates, ...loadedSheetTemplates];
    const errorsLoadedTemplates = allTemplates.filter(templateResult => templateResult.status == "Falha");
    logTemplateErrors("Erros ao carregar os templates", errorsLoadedTemplates);

    console.table(allTemplates);
    console.log('-> Todos os templates foram registados!');
}

async function loadAuxiliaryTemplates() {
    const configTemplates = [
        { call: "buttons-dialog", path: "others/buttons-dialog" },
        { call: "roll-chat-mode", path: "others/roll-chat-mode" },
    ];

    const loadedAuxiliaryTemplates = await loadAndRegisterTemplates(configTemplates);

    addOnRegisteredTemplates(loadedAuxiliaryTemplates);

    return loadedAuxiliaryTemplates;
}

async function loadSheetTemplates() {
    const sheetTemplates = [
        { model: 'Actor', method: actorTemplatesRegister() },
        { model: 'Items', method: equipmentTemplatesRegister() },
    ];

    const results = await Promise.all(sheetTemplates.map(async (template) => {
        try {
            const loadedTemplates = await template.method;
            return { template: template.model, status: "Sucesso", loadedTemplates };
        } catch (error) {
            console.error(error);
            return { template: template.model, status: "Falha", loadedTemplates };
        }
    }));
    console.table(results);
    const errors = results.filter(result => result.status == "Falha");
    logTemplateErrors("Erros ao carregar os registers", errors);

    const allSheetTemplates = results.flatMap(item => item.loadedTemplates);
    addOnRegisteredTemplates(allSheetTemplates);

    return allSheetTemplates;
}

export async function loadAndRegisterTemplates(inputTemplates = []) {
    const basePath = `systems/${SYSTEM_ID}/templates`;
    const fullTemplates = inputTemplates.map(template => ({
        ...template,
        fullPath: `${basePath}/${template.path}.hbs`
    }));

    const templatesToLoad = fullTemplates.filter(template => !Handlebars.partials[template.fullPath]);

    await loadTemplates(templatesToLoad.map(template => template.fullPath));

    const results = await Promise.all(fullTemplates.map(async ({ call, path, fullPath }) => {
        if (!call) {
            return { call: null, path, fullPath, status: "Ignorado (sem call)" };
        }

        const partialContent = Handlebars.partials[fullPath];
        if (!partialContent) {
            return { call, path, fullPath, status: "Falha (não encontrado)" };
        }

        try {
            Handlebars.registerPartial(call, partialContent);
            return { call, path, fullPath, status: "Sucesso" };
        } catch (error) {
            return { call, path, fullPath, status: "Falha" };
        }
    }));

    return results;
}

function addOnRegisteredTemplates(templates) {
    for (const { fullPath, status } of templates) {
        if (!status.includes('Falha')) {
            REGISTERED_TEMPLATES.add(fullPath);
        }
    }
}

function logTemplateErrors(label, errors) {
    if (errors.length > 0) {
        console.error(`⛔ ${label}`);
        console.table(errors);
    }
}