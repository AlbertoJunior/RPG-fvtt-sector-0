export class ConfirmationDialog {
    static open(params = { message: '', onConfirm: () => { }, onCancel: () => { } }) {
        const { message, onConfirm, onCancel } = params;

        const content = `
        <div style="display: flex; margin-block: 10px; flex-direction: column; align-items: stretch; row-gap: 10px;">
        <h2 style="margin: 0px">Tem certeza que deseja realizar essa operação?</h2>
        <span>
        ${message}
        </span>
        </div>
        `;

        new Dialog({
            title: "Selecionar Item",
            content: content,
            buttons: {
                cancel: {
                    label: "Cancelar",
                    callback: (html) => {
                        onCancel?.();
                    }
                },
                confirm: {
                    label: "Confirmar",
                    callback: (html) => {
                        onConfirm?.();
                    }
                }
            },
            close: () => { }
        }).render(true);
    }
}