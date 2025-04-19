import { TODO } from "../../../scripts/utils/utils.mjs";

export class UpdateEquipmentQuantityDialog {
    static async updateQuantityDialog(quantity, onConfirm = () => { }) {
        TODO('refazer, colocando em um arquivo .hbs o content')

        const content = `
                <form style="margin-block:10px">
                    <div>
                        <h3>Atual: ${quantity}</h3>
                        <div class="form-group">
                            <label for="quantity">Quantidade:</label>
                            <input id="quantity" type="number" step="1">
                        </div>
                    </div>
                </form>
            `;

        new Dialog({
            title: "Alterar quantidade",
            content: content,
            buttons: {
                cancel: {
                    label: "Remover",
                    callback: (html) => {
                        const attr1 = parseInt(html.find("#quantity").val());
                        onConfirm?.(-attr1);
                    }
                },
                confirm: {
                    label: "Adicionar",
                    callback: (html) => {
                        const attr1 = parseInt(html.find("#quantity").val());
                        onConfirm?.(attr1);
                    }
                }
            }
        }).render(true);
    }
}