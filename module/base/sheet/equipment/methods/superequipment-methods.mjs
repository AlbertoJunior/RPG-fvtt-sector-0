import { getObject, localize, onArrayRemove, randomId } from "../../../../../scripts/utils/utils.mjs";
import { CreateFormDialog } from "../../../../creators/dialog/create-dialog.mjs";
import { EquipmentCharacteristicType } from "../../../../enums/equipment-enums.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs";
import { SuperEquipmentTraitRepository } from "../../../../repository/superequipment-trait-repository.mjs";
import { EquipmentUpdater } from "../../../updater/equipment-updater.mjs";

export const handlerSuperEquipmentEvents = {
    [OnEventType.ADD]: async (item, event) => SuperEquipmentSheeHandle.add(item, event),
    [OnEventType.REMOVE]: async (item, event) => SuperEquipmentSheeHandle.remove(item, event),
    [OnEventType.EDIT]: async (item, event) => SuperEquipmentSheeHandle.edit(item, event),
}

class SuperEquipmentSheeHandle {
    static add(item, event) {
        const dataset = event.currentTarget.dataset;

        if (dataset.subcharacteristic == 'trait') {
            this.#addTrait(item, dataset.type);
        }
    }

    static #addTrait(item, type) {
        let title;
        let listTraits;
        let characteristic;

        if (type == 'good') {
            title = localize('Itens.Efeitos');
            listTraits = SuperEquipmentTraitRepository.getGoodTraits();
            characteristic = EquipmentCharacteristicType.SUPER_EQUIPMENT.EFFECTS;
        } else {
            title = localize('Itens.Defeitos');
            listTraits = SuperEquipmentTraitRepository.getBadTraits();
            characteristic = EquipmentCharacteristicType.SUPER_EQUIPMENT.DEFECTS;
        }

        CreateFormDialog._open(
            title,
            'items/dialog/superequipment-effect-dialog',
            {
                presetForm: {
                    traits: this.#mapOptions(listTraits, null)
                },
                render: (html, windowApp) => {
                    const select = html.find('select[name="selectedTrait"]');
                    const particularityContainer = html.find('#particularityContainer');
                    const input = html.find('input[name="particularity"]');
                    const description = html.find('.S0-container .S0-message-simple-text');
                    const cost = html.find('#costValue');

                    function updateInputVisibility() {
                        const selected = select.val();
                        const trait = SuperEquipmentTraitRepository.getItemByTypeAndId(type, selected);

                        description.text(trait.description);
                        cost.text(trait.cost);

                        if (trait?.particularity != null) {
                            input.text('')
                            particularityContainer.show();
                        } else {
                            input.text(null)
                            particularityContainer.hide();
                        }
                        windowApp.style.height = 'auto';
                    }

                    select.on('change', updateInputVisibility);
                    updateInputVisibility();
                },
                onConfirm: (data) => {
                    const { selectedTrait, particularity } = data;
                    const selected = listTraits.find(trait => trait.id == selectedTrait);
                    const actualList = getObject(item, characteristic) || [];
                    const copyObject = {
                        ...selected,
                        id: `${randomId(10)}.${selected.id}`,
                        particularity: !particularity && particularity.trim().length > 0 ? particularity : null,
                    };
                    EquipmentUpdater.updateEquipment(item, characteristic, [...actualList, copyObject]);
                }
            }
        );
    }

    static #mapOptions(list, selectedItem) {
        const groups = {};
        const costText = localize('Custo');

        list.forEach((attr, index) => {
            const groupLabel = `${costText}: ${attr.cost}`;

            if (!groups[groupLabel]) {
                groups[groupLabel] = [];
            }

            const isSelected = selectedItem?.id === attr.id ? 'selected' : '';

            groups[groupLabel].push({
                ...attr,
                index,
                isSelected,
            });
        });

        return Object.entries(groups)
            .sort(([labelA], [labelB]) => {
                const costA = parseInt(labelA.replace(`${costText}:`, "").trim());
                const costB = parseInt(labelB.replace(`${costText}:`, "").trim());
                return costA - costB;
            })
            .map(([label, options]) => (
                {
                    label,
                    options
                }
            ));
    }

    static async remove(item, event) {
        const dataset = event.currentTarget.dataset;
        const itemId = dataset.itemId;

        async function verifyAndRemove(characteristic) {
            const list = getObject(item, characteristic) || [];
            const itemIndex = list.findIndex(trait => trait.id == itemId);
            if (itemIndex >= 0) {
                onArrayRemove(list, list[itemIndex]);
                await EquipmentUpdater.updateEquipment(item, characteristic, list);
                return true;
            }
            return false;
        }

        await verifyAndRemove(EquipmentCharacteristicType.SUPER_EQUIPMENT.EFFECTS) ||
            await verifyAndRemove(EquipmentCharacteristicType.SUPER_EQUIPMENT.DEFECTS);
    }

    static edit(item, event) {

    }
}