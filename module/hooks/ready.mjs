import { loadPackages } from "../../scripts/utils/repositories.mjs";

export class ReadyHookHandle {
    static async handle() {
        await loadPackages();
        console.log('-> Setor 0 - O Submundo | Sistema Pronto');
    }
}