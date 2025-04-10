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
    li.classList = options?.classList || '';

    if (options.icon) {
        const icon = _createIcon(options.icon);
        if (icon) {
            li.appendChild(icon);
        }
    }

    const text = document.createTextNode(textContent);
    li.appendChild(text);
    return li;
}

export function _createIcon(options = {}) {
    const iconClass = options.class;
    if (!iconClass) {
        return;
    }

    const i = document.createElement("i");
    i.classList = iconClass;

    const optionsKeys = Object.keys(options).filter(key => key !== 'class');
    for (const key of optionsKeys) {
        i.style[key] = options[key];
    }    

    return i;
}