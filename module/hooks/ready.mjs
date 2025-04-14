import { RepositoriesUtils } from "../utils/repositories.mjs";

export class ReadyHookHandle {
    static async handle() {
        await RepositoriesUtils.loadFromPackages();
        await RepositoriesUtils.loadFromGame();
        console.log('-> Setor 0 - O Submundo | Sistema Pronto');
    }
}