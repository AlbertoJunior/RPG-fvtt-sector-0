import { SystemFlags } from "../enums/flags-enums.mjs";
import { OnEventType } from "../enums/on-event-type.mjs";
import { FlagsUtils } from "../utils/flags-utils.mjs";

export const menuHandleMethods = {
    [OnEventType.CHECK]: async (item, event) => {
        const type = event.currentTarget.dataset.type;
        switch (type) {
            case 'edit': {
                const actualMode = FlagsUtils.getItemFlag(item, SystemFlags.MODE.EDITABLE);
                await FlagsUtils.setItemFlag(item, SystemFlags.MODE.EDITABLE, !actualMode);
                return;
            }
            case 'dark': {
                const actualMode = FlagsUtils.getItemFlag(game.user, SystemFlags.MODE.DARK, false);
                await FlagsUtils.setItemFlag(game.user, SystemFlags.MODE.DARK, !actualMode);
                item.sheet.render();
                return;
            }
            case 'compact': {
                const actualMode = FlagsUtils.getItemFlag(game.user, SystemFlags.MODE.COMPACT, false);
                await FlagsUtils.setItemFlag(game.user, SystemFlags.MODE.COMPACT, !actualMode);
                item.sheet.render();
                return;
            }
        }
    }
}