export function _createEmptyOption() {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = '';
    return option;
}

export function _createOption(value, textContent) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = textContent;
    return option;
}