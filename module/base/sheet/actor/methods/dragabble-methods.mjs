import { getObject } from "../../../../../scripts/utils/utils.mjs";
import { ActorEquipmentUtils } from "../../../../core/actor/actor-equipment.mjs";
import { ActorUpdater } from "../../../updater/actor-updater.mjs";
import { CharacteristicType } from "../../../../enums/characteristic-enums.mjs"

export class SheetActorDragabbleMethods {
    static async setup(html, actor) {
        if (!window.Sortable) {
            return;
        }

        html.find(`#bag-${actor.id}`).on('drop', this._onDropOnBag.bind(this, actor))

        this.#setupShortcutDrag(html, actor);
        this.#setupBagDrag(html, actor);
    }

    static #setupShortcutDrag(html, actor) {
        const containerShortcut = html[0].querySelector(`#shortcuts-container-${actor.id}`);
        if (containerShortcut) {
            window.Sortable.create(containerShortcut, {
                animation: 150,
                handle: ".draggable",
                draggable: ".draggable",
                onEnd: (evt) => {
                    const shortcuts = getObject(actor, CharacteristicType.SHORTCUTS);
                    const newOrder = Array.from(containerShortcut.children)
                        .map(element => {
                            const id = element.querySelector("[data-item-id]")?.dataset?.itemId;
                            return shortcuts.find(shortcut => shortcut.id == id);
                        }).filter(Boolean);

                    ActorUpdater._verifyAndUpdateActor(actor, CharacteristicType.SHORTCUTS, newOrder);
                }
            });
        }
    }

    static #setupBagDrag(html, actor) {
        const actorId = actor.id;
        const equippedList = html[0].querySelector(`#equipped-${actorId}`);
        const bagList = html[0].querySelector(`#bag-${actorId}`);
        if (equippedList && bagList) {
            const sortableOptions = {
                group: `equipment-move-inner-${actorId}`,
                animation: 150,
                draggable: "li",
                handle: ".S0-item-bag",
                onEnd: async (evt) => {
                    const origin = evt.from.id;
                    const destination = evt.to.id;
                    const itemElement = evt.item.querySelector("[data-item-id]");
                    const itemId = itemElement?.dataset?.itemId;

                    if (!itemId) {
                        console.warn("-> possível erro ao pegar o id");
                        return;
                    }

                    const equipment = ActorEquipmentUtils.getActorEquipmentById(actor, itemId);
                    if (!equipment) {
                        console.warn("-> possível erro ao pegar o equipamento");
                        return
                    }
                    const originSource = origin.split('-')[0];

                    if (origin == destination) {
                        this.#sortEquipments(actor, originSource, bagList, equippedList);
                    } else {
                        this.#equipOrUnequip(actor, originSource, equipment);
                    }
                }
            };

            window.Sortable.create(equippedList, sortableOptions);
            window.Sortable.create(bagList, sortableOptions);
        }
    }

    static async #sortEquipments(actor, originSource, bagList, equippedList) {
        const equipped = ActorEquipmentUtils.getActorEquippedItems(actor);
        const unequipped = ActorEquipmentUtils.getActorFilteredUnequippedEquipment(actor);

        let elementContainer, sourceItems, staticItems;

        if (originSource === 'bag') {
            elementContainer = bagList;
            sourceItems = unequipped;
            staticItems = equipped;
        } else if (originSource === 'equipped') {
            elementContainer = equippedList;
            sourceItems = equipped;
            staticItems = unequipped;
        } else {
            console.warn("-> possível erro ao pegar a fonte de onde saiu o item");
            return;
        }

        const newOrder = Array.from(elementContainer.children)
            .map(element => {
                const id = element.querySelector("[data-item-id]")?.dataset?.itemId;
                return sourceItems.find(item => item.id === id);
            })
            .filter(Boolean);

        const orderedItems = originSource === 'bag' ? [...staticItems, ...newOrder] : [...newOrder, ...staticItems];

        const finalItems = orderedItems.map((item, index) => ({
            _id: item.id,
            sort: index * 100
        }));

        ActorUpdater.updateDocuments(actor, finalItems);
    }

    static async #equipOrUnequip(actor, originSource, equipment) {
        if (originSource == 'bag') {
            await ActorEquipmentUtils.equip(actor, equipment);
        } else if (originSource == 'equipped') {
            await ActorEquipmentUtils.unequip(actor, equipment);
        } else {
            console.warn("-> possível erro ao pegar a fonte de onde saiu o item");
        }
    }

    static async _onDropOnBag(actor, event) {
        if (!actor.isOwner) {
            return;
        }

        const textPlain = event.originalEvent.dataTransfer.getData("text/plain");
        let data;
        try {
            data = JSON.parse(textPlain);
        } catch (error) {
            return;
        }

        if (data?.type !== "Item") {
            return;
        }

        event.preventDefault();
        event.originalEvent.preventDefault();
        const item = await Item.implementation.fromDropData(data);
        const itemData = ActorEquipmentUtils.createDataItem(item);
        ActorUpdater.addDocuments(actor, [itemData]);
    }
}