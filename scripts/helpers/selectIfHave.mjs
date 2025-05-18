import { CustomRoll } from "../../module/core/rolls/custom-roll.mjs";

export default function selectIfHave(actor, characteristic, index) {
    if (!actor || !characteristic) {
        return "";
    }

    const data = CustomRoll.mountData(actor);
    const level = CustomRoll.operateAllPossibilities(actor, data, characteristic, '')?.value || 0;
    return level >= (index + 1) ? "S0-selected" : "";
}