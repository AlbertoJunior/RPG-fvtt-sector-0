import { equipmentTypeIdToTypeString, validEquipmentTypes } from "../../module/enums/equipment-enums.mjs";
import { MorphologyRepository } from "../../module/repository/morphology-repository.mjs";
import { DistrictRepository } from "../../module/repository/district-repository.mjs";
import { EnhancementRepository } from "../../module/repository/enhancement-repository.mjs";
import { TraitRepository } from "../../module/repository/trait-repository.mjs";
import { LanguageRepository } from "../../module/repository/language-repository.mjs";
import { localizeType } from "../utils/utils.mjs";
import { AbilityRepository } from "../../module/repository/ability-repository.mjs";
import { AttributeRepository } from "../../module/repository/attribute-repository.mjs";
import { RepertoryRepository } from "../../module/repository/repertory-repository.mjs";
import { VirtuesRepository } from "../../module/repository/virtues-repository.mjs";
import { FameRepository } from "../../module/repository/fame-repository.mjs";
import { NpcQualityRepository } from "../../module/repository/npc-quality-repository.mjs";
import { EquipmentInfoParser } from "../../module/core/equipment/equipment-info.mjs";

const map = {
    'morphology': MorphologyRepository._getItems(),
    'district': DistrictRepository._getItems(),
    'enhancement': EnhancementRepository._getItems(),
    'trait-good': TraitRepository._getGoodTraits(),
    'trait-bad': TraitRepository._getBadTraits(),
    'language': LanguageRepository._getItems(),
    'attribute': AttributeRepository._getItems(),
    'ability': AbilityRepository._getItems(),
    'repertory': RepertoryRepository._getItems(),
    'virtue': VirtuesRepository._getItems(),
    'fame': FameRepository._getItems(),
    'npc-fame': FameRepository._getItemsNpc(),
    'npc-quality': NpcQualityRepository._getItems(),
    'equipment-types': getActorEquipmentTypes,
    'equipment-occultability': EquipmentInfoParser.getOccultabilityTypes,
    'equipment-damage-type': EquipmentInfoParser.getDamageTypes,
    'equipment-hand-type': EquipmentInfoParser.getHandTypes,
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