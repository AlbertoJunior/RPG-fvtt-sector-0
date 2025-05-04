import { NotificationsUtils } from "../../module/creators/message/notifications.mjs";

function containClass(element, cls) {
    return element.classList.contains(cls);
}

function isCharacteristic(element) {
    return containClass(element, 'S0-characteristic') || containClass(element, 'S0-characteristic-6') || containClass(element, 'S0-characteristic-temp');
}

export function selectCharacteristic(element) {
    if (!element) {
        return;
    }

    if (!isCharacteristic(element)) {
        return;
    }

    element.classList.toggle('S0-selected');

    let next = element.nextElementSibling;
    while (next) {
        if (isCharacteristic(next)) {
            next.classList.remove('S0-selected');
        }
        next = next.nextElementSibling;
    }

    let before = element.previousElementSibling;
    while (before) {
        if (isCharacteristic(before)) {
            before.classList.add('S0-selected');
        }
        before = before.previousElementSibling;
    }

    element.blur();
}

export function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

export function keyJsonToKeyLang(key) {
    const removeUnderscore = key.replaceAll('_', ' ');
    const toTitle = toTitleCase(removeUnderscore);
    const langKey = toTitle.replaceAll(' ', '_');
    return `S0.${langKey}`;
}

export function localize(key) {
    return game.i18n.localize(`S0.${key}`)
}

export function onArrayRemove(array, item) {
    const indexToRemove = array.indexOf(item);
    if (indexToRemove !== -1) {
        array.splice(indexToRemove, 1);
        return true;
    }
    return false;
}

export function localizeType(key) {
    return game.i18n.localize(`TYPES.${key}`)
}

export function TODO(message, notify) {
    console.warn(`-> ${message}`);
    if (notify) {
        NotificationsUtils._info(message);
    }
}

export function getObject(object, path) {
    let pathHaveSystem = path;
    if (path.system) {
        pathHaveSystem = path.system;
    }

    return pathHaveSystem.split('.').reduce((acc, key) => acc && acc[key], object);
}

export function randomId() {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);
    return id.replaceAll('-', '');
}

export function convertToCollection(items) {
    return new foundry.utils.Collection(items.map(item => [item.id, item]));
}

export function snakeToCamel(entries) {
    const camelCaseData = {};
    for (const [key, value] of entries) {
        const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
        camelCaseData[camelKey] = value;
    }
    return camelCaseData;
}

export function normalizeString(str) {
    return str.replace(/\s+/g, ' ').trim();
}