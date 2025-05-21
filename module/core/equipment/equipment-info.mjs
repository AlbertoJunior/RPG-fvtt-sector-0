import { localize } from "../../../scripts/utils/utils.mjs";
import { DamageType, EquipmentHand, EquipmentHidding, VehicleType } from "../../enums/equipment-enums.mjs";

export class EquipmentInfoParser {

    static parseHidding(value) {
        const map = {
            [EquipmentHidding.POCKET]: `${localize('Itens.Bolso')}`,
            [EquipmentHidding.JACKET]: `${localize('Itens.Jaqueta')}`,
            [EquipmentHidding.NONE]: `${localize('Itens.Inocultavel')}`,
        }
        return map[value] || `<${localize('Erro')}>`;
    }

    static parseHand(value) {
        const map = {
            [EquipmentHand.ONE_HAND]: `${localize('Itens.Uma_Mao')}`,
            [EquipmentHand.ONE_HALF_HAND]: `${localize('Itens.Uma_Mao_Meia')}`,
            [EquipmentHand.TWO_HANDS]: `${localize('Itens.Duas_Maos')}`,
        }
        return map[value] || `<${localize('Erro')}>`;
    }

    static parseDamageType(value) {
        const map = {
            [DamageType.SUPERFICIAL]: `${localize('Itens.Superficial')}`,
            [DamageType.LETAL]: `${localize('Itens.Letal')}`,
            [DamageType.ELETRIC]: `${localize('Itens.Eletrico')}`,
            [DamageType.FIRE]: `${localize('Itens.Fogo')}`,
            [DamageType.ICE]: `${localize('Itens.Gelo')}`,
        }
        return map[value] || `<${localize('Erro')}>`;
    }

    static parseVehicle(value) {
        const map = {
            [VehicleType.JUNKER]: `${localize('Itens.Lata')}`,
            [VehicleType.ECONOMY]: `${localize('Itens.Popular')}`,
            [VehicleType.UTILITARY]: `${localize('Itens.Utilitario')}`,
            [VehicleType.SPORT]: `${localize('Itens.Esportivo')}`,
            [VehicleType.SUPER_SPORT]: `${localize('Itens.Super_Esportivo')}`,
            [VehicleType.RAW]: `${localize('Itens.Bruto')}`,
            [VehicleType.EXOTIC]: `${localize('Itens.Exotico')}`,
        }
        return map[value] || `<${localize('Erro')}>`;
    }

    static getHandTypes() {
        return Object.values(EquipmentHand).map(type => {
            return {
                id: type,
                label: EquipmentInfoParser.parseHand(type)
            }
        });
    }

    static getOccultabilityTypes() {
        return Object.values(EquipmentHidding).map(type => {
            return {
                id: type,
                label: EquipmentInfoParser.parseHidding(type)
            }
        });
    }

    static getDamageTypes() {
        return Object.values(DamageType).map(type => {
            return {
                id: type,
                label: EquipmentInfoParser.parseDamageType(type)
            }
        });
    }

    static getVehicleTypes() {
        return Object.values(VehicleType).map(type => {
            return {
                id: type,
                label: EquipmentInfoParser.parseVehicle(type)
            }
        });
    }
}