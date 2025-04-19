export class DialogUtils {
    static presetDialogRender(html) {
        const div = html[0].parentElement;
        div.classList.add('S0-content');

        const header = div.parentElement.children[0].children;
        for (const child of header) {
            child.style.color = 'var(--primary-color)';
        }

        const buttons = div.querySelectorAll('.dialog-button').length || 0;
        if (buttons == 0) {
            div.querySelector('.dialog-buttons').remove();
        }
    }
}