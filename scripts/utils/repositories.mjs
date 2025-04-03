import { EnhancementRepository } from "../repository/enhancement-repository.mjs";
import { LanguageRepository } from "../repository/language-repository.mjs";
import { TraitRepository } from "../repository/trait-repository.mjs";

export async function loadPackages() {
    const repositories = [
        { repo: EnhancementRepository, method: '_loadFromPack' },
        { repo: LanguageRepository, method: '_loadFromPack' },
        { repo: TraitRepository, method: '_loadFromPack' }
    ];

    const results = await Promise.all(
        repositories.map(({ repo, method }) =>
            (async () => {
                try {
                    await repo[method]();
                    return { Repository: repo.name, Status: "Sucesso" };
                } catch (error) {
                    console.error(error);
                    return { Repository: repo.name, Status: "Falha" };
                }
            })()
        )
    );

    console.log('-> Todos os pacotes foram processados!');
    console.table(results);
}