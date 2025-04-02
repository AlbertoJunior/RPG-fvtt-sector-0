export class NotificationsUtils {
    static async _info(message) {
        ui.notifications.info(message);
    }
    static async _error(message) {
        ui.notifications.error(message);
    }
    static async _warning(message) {
        ui.notifications.warn(message);
    }
}