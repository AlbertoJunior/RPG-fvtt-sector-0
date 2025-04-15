export default function gameFunc(func) {
    switch (func) {
        case 'isGm': {
            return game.user.isGM;
        }
        case 'isOwner': {
            return game.user.isOwner;
        }
    }
    return false;
}