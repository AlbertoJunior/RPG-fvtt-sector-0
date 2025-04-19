export class HtmlJsUtils {
    static getActualHeight(element) {
        const windowElem = element.closest(".window-app");
        if (!windowElem)
            return undefined;

        return windowElem.offsetHeight;
    }

    static expandOrContractElement(element, params) {
        const windowElem = element.closest(".window-app");
        if (!windowElem)
            return;

        return this.#operate(element, windowElem, params);
    }


    static expandOrContractMessageElement(element, params) {
        const windowElem = element.closest(".message-content");
        if (!windowElem)
            return;

        return this.#operate(element, windowElem, params);
    }

    static #operate(element, windowElem, params) {
        const expanded = element.classList.toggle("S0-expanded");

        const { minHeight, maxHeight, marginBottom = 0 } = params;

        const currentHeight = windowElem.offsetHeight;
        const scrollSize = element.scrollHeight;
        const scrollWithMargin = scrollSize - marginBottom;
        const newHeight = expanded
            ? Math.min(currentHeight + scrollWithMargin, maxHeight)
            : Math.max(currentHeight - scrollWithMargin, minHeight);

        windowElem.classList.add("S0-expand-animating");
        windowElem.style.height = `${newHeight}px`;

        setTimeout(() => {
            windowElem.classList.remove("S0-expand-animating");
        }, 300);

        return expanded;
    }
}