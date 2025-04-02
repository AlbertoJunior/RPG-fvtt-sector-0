import { EnhancementRepository } from "../repository/enhancement-repository.mjs";
import { LanguageRepository } from "../repository/language-repository.mjs";
import { TraitRepository } from "../repository/trait-repository.mjs";

const map = {
    'enhancement': EnhancementRepository._getItems(),
    'trait-good': TraitRepository._getGoodTraits(),
    'trait-bad': TraitRepository._getBadTraits(),
    'language': LanguageRepository._getItems(),
}

export default function fetchRepository(repositoryName) {
    if (repositoryName) {
        return map[repositoryName]
    }
    console.warn(`-> [${repositoryName}] não existe no mapper`)
    return [];
}