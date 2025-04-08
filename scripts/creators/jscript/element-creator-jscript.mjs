export function _createEmptyOption() {
    return _createOption('', '');
}

export function _createOption(value, textContent, data) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = textContent;
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            option.dataset[key] = value;
        });
    }
    return option;
}

export function _createLi(textContent, options = {}) {
    const li = document.createElement("li");
    li.textContent = textContent;
    li.classList = options?.classList || '';
    return li;
}