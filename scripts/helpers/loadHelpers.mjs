export async function loadHandlebarsHelpers() {
    console.log("Carregando helpers do Handlebars...");
    const helpersPath = "systems/setor0OSubmundo/scripts/helpers/";
    const helperFiles = [
        "eq.mjs"
    ];
    for (const file of helperFiles) {
        const path = `${helpersPath}${file}`;
        try {
            const module = await import(path);
            const functionName = file.replace(".mjs", "");

            Handlebars.registerHelper(functionName, module.default);
            console.log(`Helper '${functionName}' registrado.`);
        } catch (error) {
            console.error(`Erro ao carregar helper '${file}':`, error);
        }
    }
}