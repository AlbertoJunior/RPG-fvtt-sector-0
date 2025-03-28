export function containClass(element, cls) {
    return element.classList.contains(cls);
}

export function selectCharacteristic(element) {
    function isCharacteristic(element) {
        return containClass(element, 'caracteristica') || containClass(element, 'caracteristica-6');
    }

    if (isCharacteristic(element)) {
        element.classList.toggle('selected');

        let next = element.nextElementSibling;
        while (next) {
            if (isCharacteristic(next))
                next.classList.remove('selected');
            next = next.nextElementSibling;
        }

        let before = element.previousElementSibling;
        while (before) {
            if (isCharacteristic(before))
                before.classList.add('selected');
            before = before.previousElementSibling;
        }
    }
    element.blur();
}

export async function setActorFlag(actor, flag, value) {
    actor.setFlag("setor0OSubmundo", flag, value);
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

export function notification(message) {
    ui.notifications.info(message);
}

export function TODO(message, notify) {
    console.warn(message);
    if (notify) {
        notification(message);
    }
}