export async function loadHandlebarsHelpers() {
    console.log("-> Carregando helpers do Handlebars...");
    const helpersPath = "/scripts/helpers/";
    const helperFiles = [
        "eq.mjs",
        "lt.mjs",
        "selectIfEq.mjs",
        "fetchRepository.mjs",
        "forLoop.mjs",
        "actorValues.mjs",
    ];

    const resultLog = await Promise.all(helperFiles.map(async (file) => {
        const path = `${helpersPath}${file}`;
        const functionName = file.replace(".mjs", "");

        try {
            const module = await import(/* @vite-ignore */ `../../${path}`);
            Handlebars.registerHelper(functionName, module.default);
            return { Helper: functionName, Status: "Sucesso", Path: path };
        } catch (error) {
            console.error(error);
            return { Helper: functionName, Status: "Falha", Path: path };
        }
    }));

    console.table(resultLog);
}