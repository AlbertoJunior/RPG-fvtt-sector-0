import { localize } from "../../../scripts/utils/utils.mjs";

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

export function _createOptionGroup(label) {
    const optGroup = document.createElement('optgroup');
    optGroup.label = label;
    return optGroup;
}

export function _createOptionsAndSetOnSelects(selects = [], options = []) {
    selects.forEach(select => {
        select.innerHTML = '';
        select.appendChild(_createEmptyOption());

        const groups = new Map();

        options.forEach(({ id, name, level }) => {
            if (!groups.has(level)) {
                groups.set(level, _createOptionGroup(`${localize('Nivel')}: ${level}`));
            }

            const group = groups.get(level);
            group.appendChild(_createOption(id, name));
        });

        [...groups.entries()]
            .sort(([a], [b]) => a - b)
            .forEach(([, group]) => select.appendChild(group));
    });
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