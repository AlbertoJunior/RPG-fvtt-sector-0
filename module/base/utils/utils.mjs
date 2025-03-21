export function containClass(element, cls) {
    return element.classList.contains(cls);
}

export function selectCharacteristic(element) {
    if (containClass(element, 'caracteristica') || containClass(element, 'caracteristica-6')) {
        element.classList.toggle('selected');

        let next = element.nextElementSibling;
        while (next) {
            if (containClass(next, 'caracteristica-6') || containClass(next, 'caracteristica'))
                next.classList.remove('selected');
            next = next.nextElementSibling;
        }

        let before = element.previousElementSibling;
        while (before) {
            if (containClass(before, 'caracteristica-6') || containClass(before, 'caracteristica'))
                before.classList.add('selected');
            before = before.previousElementSibling;
        }
    }
    element.blur();
}

export async function setActorFlag(actor, flag, value) {
    actor.setFlag("setor0OSubmundo", flag, value);
}

export function getActorFlag(flag) {
    return actor.getFlag("setor0OSubmundo", "editable") || false;
}