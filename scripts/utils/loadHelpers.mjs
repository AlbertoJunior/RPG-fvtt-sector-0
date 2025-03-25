export async function loadHandlebarsHelpers() {
    console.log("Carregando helpers do Handlebars...");
    const helpersPath = "/scripts/helpers/";
    const helperFiles = [
        "eq.mjs",
        "selectIfEq.mjs",
    ];

    for (const file of helperFiles) {
        const path = `${helpersPath}${file}`;
        try {
            console.log(`Tentando importar: ${path}`);
            const module = await import(/* @vite-ignore */ `../../${path}`);
            const functionName = file.replace(".mjs", "");

            Handlebars.registerHelper(functionName, module.default);
            console.log(`Helper '${functionName}' registrado.`);
        } catch (error) {
            console.error(`Erro ao carregar helper '${file}':`, error);
        }
    }
}