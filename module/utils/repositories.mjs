import { EnhancementRepository } from "../repository/enhancement-repository.mjs";
import { LanguageRepository } from "../repository/language-repository.mjs";
import { TraitRepository } from "../repository/trait-repository.mjs";
import { EquipmentRepository } from "../repository/equipment-repository.mjs";
import { DistrictRepository } from "../repository/district-repository.mjs";
import { MorphologyRepository } from "../repository/morphology-repository.mjs";

export class RepositoriesUtils {
    static async loadFromPackages() {
        const repositories = [
            { repo: EnhancementRepository, method: '_loadFromPack' },
            { repo: LanguageRepository, method: '_loadFromPack' },
            { repo: TraitRepository, method: '_loadFromPack' },
            { repo: EquipmentRepository, method: '_loadFromPack' },
            { repo: DistrictRepository, method: '_loadFromPack' },
            { repo: MorphologyRepository, method: '_loadFromPack' },
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

    static async loadFromGame() {
        const repositories = [
            { repo: EquipmentRepository, method: '_loadFromGame' }
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

        console.log('-> Todos os objetos do Jogo foram processados!');
        console.table(results);
    }
}