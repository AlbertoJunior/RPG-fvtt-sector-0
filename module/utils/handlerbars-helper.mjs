export async function loadHandlebarsHelpers() {
    console.log("-> Carregando helpers do Handlebars...");
    const helpersPath = "/scripts/helpers/";
    const helperFiles = [
        "selectIfEq.mjs",
        "fetchRepository.mjs",
        "forLoop.mjs",
        "actorValues.mjs",
        "actorLists.mjs",
        "isEmpty.mjs",
        "gameFunc.mjs",
        "isNull.mjs",
        "concat.mjs",
        "operators.mjs",
        "htmlUtils.mjs",
        "parse.mjs",
        "selectIfHave.mjs",
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