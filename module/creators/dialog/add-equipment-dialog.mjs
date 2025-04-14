import { TODO } from "../../../scripts/utils/utils.mjs";

export class AddEquipmentDialog {
    static async showItemSelectorDialog(items, onSelect = () => { }) {
        TODO('refazer, colocando em um arquivo .hbs o content')
        const selectedItems = new Set();

        const content = `
          <div class="item-selector-dialog">
            <input type="text" class="item-filter-input" placeholder="Filtrar por nome ou tipo...">
      
            <div class="item-carousel"></div>
            
            <hr>
            
            <div class="item-details">Selecione um item para ver detalhes.</div>
        
            <button class="add-item-button" disabled>Adicionar</button>
          </div>
        `;

        function renderItems(html, filteredItems, dialog) {
            const carousel = html.find(".item-carousel");
            const details = html.find(".item-details");
            const addButton = html.find(".add-item-button");
            const filterInput = html.find(".item-filter-input");

            filterInput.on("input", () => {
                const query = filterInput.val().toLowerCase();
                const filtered = items.filter(i => i.name.toLowerCase().includes(query));
                renderItems(html, filtered, dialog);
            });

            addButton.on("click", () => {
                onSelect(selectedItems);
                dialog.close();
            });

            carousel.empty();
            for (const item of filteredItems) {
                const card = createItemCard(item, html);

                card.on("click", () => {
                    details.html(`
                        <strong>${item.name}</strong>
                        <br>
                        ${item.description ?? "Sem descrição."}
                        `);
                });

                carousel.append(card);
            }
        }

        function createItemCard(item, html) {
            const card = $('<div>', { class: 'item-card' });
            const checkbox = $('<input>', { type: 'checkbox' });
            const checkboxWrapper = $('<div>', { class: 'checkbox-wrapper' }).append(checkbox);
            const img = $('<img>', {
                src: item.img,
                alt: item.name,
            });
            const name = $('<span>').text(item.name);

            card.append(checkboxWrapper, img, '<br>', name);

            checkbox.on("change", (event) => {
                if (event.target.checked) {
                    selectedItems.add(item);
                    card.addClass("selected");
                } else {
                    selectedItems.delete(item);
                    card.removeClass("selected");
                }
                updateSelectionCount(html);
            });

            return card;
        }

        function updateSelectionCount(html) {
            const count = selectedItems.size;
            const addButton = html.find(".add-item-button");
            addButton.text(`Adicionar (${count}) ite${count <= 1 ? 'm' : 'ns'}`);
            addButton.prop("disabled", count === 0);
        }

        const dialog = new Dialog({
            title: "Selecionar Item",
            content: content,
            buttons: {},
            render: (html) => renderItems(html, items, dialog),
            close: () => { }
        });
        dialog.render(true);
    }
}