import { NotificationsUtils } from "./notifications.mjs";

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

export async function setActorFlag(actor, flag, value) {
    await actor.setFlag("setor0OSubmundo", flag, value);
}

export function getActorFlag(actor, flag) {
    return actor.getFlag("setor0OSubmundo", flag) || false;
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

export function TODO(message, notify) {
    console.warn(`-> ${message}`);
    if (notify) {
        NotificationsUtils._info(message);
    }
}

export function getObject(object, path) {
    return path.split('.').reduce((acc, key) => acc && acc[key], object);
}