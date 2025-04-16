import { localize, localizeType } from "../../../scripts/utils/utils.mjs"
export class AddEquipmentDialog {
    static async showItemSelectorDialog(items, onSelect = () => { }) {
        const content = await this.#mountContent();
        const dialog = new Dialog({
            title: "Selecionar Item",
            content: content,
            buttons: {},
            render: (html) => this.#initRender(html, items, dialog, onSelect),
            close: () => { }
        });
        dialog.render(true);
    }

    static #initRender(html, items, dialog, onSelect = () => { }) {
        const selectedItems = new Set();

        let actualSelectedButton = undefined;
        html.find("[data-action=\"check\"]").click((event) => {
            const currentTarget = event.currentTarget;
            let newList = [];
            if (actualSelectedButton == currentTarget) {
                currentTarget.classList.remove('S0-marked');
                actualSelectedButton = undefined;

                newList = items;
            } else {
                actualSelectedButton?.classList.remove('S0-marked')
                currentTarget.classList.add('S0-marked');
                actualSelectedButton = currentTarget;

                const type = currentTarget.dataset.type;
                if(type == 'selected') {
                    newList = selectedItems;
                } else {
                    newList = items.filter(item => item.type.toLowerCase() == type);
                }
            }

            this.#renderItems(html, newList, selectedItems);
        });

        const filterInput = html.find("#filter-input");
        filterInput.on("input", () => {
            const query = filterInput.val().toLowerCase();

            let filtered = items;
            if (actualSelectedButton) {
                const type = actualSelectedButton.dataset.type;
                filtered = items.filter(item => item.type.toLowerCase() == type);
            }

            filtered = filtered.filter(i => i.name.toLowerCase().includes(query));
            this.#renderItems(html, filtered, selectedItems);
        });

        const addButton = html.find("#add-item-button");
        addButton.on("click", () => {
            onSelect(selectedItems);
            dialog.close();
        });

        this.#renderItems(html, items, selectedItems);
    }

    static #renderItems(html, filteredItems, selectedItems) {
        const carousel = html.find("#carousel");
        const addButton = html.find("#add-item-button");
        const details = html.find("#item-details");

        carousel.empty();
        for (const item of filteredItems) {
            const card = this.#createItemCard(item, selectedItems.has(item));

            card.on("click", () => {
                if (selectedItems.has(item)) {
                    selectedItems.delete(item);
                } else {
                    selectedItems.add(item);
                }
                card.toggleClass("S0-selected", selectedItems.has(item));
                this.#updateSelectionCount(addButton, selectedItems);
                this.#updateDetails(details, item, selectedItems.size === 0);
            });

            carousel.append(card);
        }
    }

    static #createItemCard(item, isSelected) {
        const card = $('<div>', { class: 'S0-item-bag S0-clickable' });
        card.toggleClass("S0-selected", isSelected);

        const img = $('<img>', { src: item.img, alt: item.name });
        const name = $('<span>', { class: 'S0-item-legend' }).text(item.name);
        card.append(img, name);
        return card;
    }

    static #updateSelectionCount(addButton, selectedItems) {
        const count = selectedItems.size;
        addButton.text(`Adicionar (${count}) ite${count <= 1 ? 'm' : 'ns'}`);
        addButton.prop("disabled", count === 0);
    }

    static #updateDetails(details, item, isEmpty) {
        if (isEmpty) {
            details.html(`Selecione um item para ver detalhes.`);
            return;
        }

        const typeString = `<strong>${localize('Tipo')}:</strong> <span>${localizeType('Item.' + item.type)}</span>`
        const nameString = `<strong>${localize('Nome')}:</strong> <span>${item.name}</span>`
        details.html(`
            ${typeString}
            <br>
            ${nameString}
            <br>
            <strong>${localize('Descricao')}:</strong>
            <section>
            ${item.description ?? "Sem descrição."}
            </section>
            `);
    }

    static async #mountContent() {
        const data = {
        }
        return await renderTemplate("systems/setor0OSubmundo/templates/items/add-equipment-dialog.hbs", data);
    }
}