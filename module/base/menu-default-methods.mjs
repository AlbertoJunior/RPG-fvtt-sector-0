import { ActorUtils } from "../core/actor/actor-utils.mjs";
import { NotificationsUtils } from "../creators/message/notifications.mjs";
import { SystemFlags } from "../enums/flags-enums.mjs";
import { OnEventType } from "../enums/on-event-type.mjs";
import { DialogUtils } from "../utils/dialog-utils.mjs";
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
    },
    [OnEventType.VIEW]: async (item, event) => {
        const type = event.currentTarget.dataset.type;
        switch (type) {
            case 'actor': {
                DialogUtils.showArtWork(item.name, item.img, true, item.uuid);
                return;
            }
            case 'token': {
                const activeToken = item.getActiveTokens()?.[0]?.document;
                if (activeToken) {
                    DialogUtils.showArtWork(`Token: ${activeToken.name}`, activeToken.texture.src, true, activeToken.uuid);
                    return;
                }

                const tokenImgs = await item.getTokenImages();
                if (tokenImgs.length > 0) {
                    DialogUtils.showArtWork(`Token: ${item.name}`, tokenImgs[0], true);
                    return;
                }

                NotificationsUtils._error("Erro ao exibir arte do Token");
                return;
            }
        }
    }
}