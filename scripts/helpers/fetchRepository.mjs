import { equipmentTypeIdToTypeString, validEquipmentTypes } from "../../module/enums/equipment-enums.mjs";
import { EnhancementRepository } from "../../module/repository/enhancement-repository.mjs";
import { TraitRepository } from "../../module/repository/trait-repository.mjs";
import { LanguageRepository } from "../../module/repository/language-repository.mjs";
import { localizeType } from "../utils/utils.mjs";

const map = {
    'enhancement': EnhancementRepository._getItems(),
    'trait-good': TraitRepository._getGoodTraits(),
    'trait-bad': TraitRepository._getBadTraits(),
    'language': LanguageRepository._getItems(),
    'equipment-types': getActorEquipmentTypes,
}

function getActorEquipmentTypes() {            
    return validEquipmentTypes().map(item => {
        const type = equipmentTypeIdToTypeString(item);
        return {
            id: item,
            label: localizeType(`Item.${type}`),
            type: type.toLowerCase(),
        }
    });
}

export default function fetchRepository(repositoryName) {
    if (repositoryName) {
        return map[repositoryName]
    }
    console.warn(`-> [${repositoryName}] não existe no mapper`)
    return [];
}