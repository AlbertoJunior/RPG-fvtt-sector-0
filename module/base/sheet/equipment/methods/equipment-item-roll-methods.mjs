import { getObject, onArrayRemove, TODO } from "../../../../../scripts/utils/utils.mjs";
import { RollAttribute } from "../../../../core/rolls/attribute-roll.mjs";
import { RollTestUtils } from "../../../../core/rolls/roll-test-utils.mjs";
import { CreateRollableTestDialog } from "../../../../creators/dialog/create-roll-test-dialog.mjs";
import { NotificationsUtils } from "../../../../creators/message/notifications.mjs";
import { ActorType } from "../../../../enums/characteristic-enums.mjs";
import { EquipmentCharacteristicType } from "../../../../enums/equipment-enums.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs"
import { DefaultActions } from "../../../../utils/default-actions.mjs";
import { EquipmentUpdater } from "../../../updater/equipment-updater.mjs";
import { playerRollHandle } from "../../actor/methods/player-roll-methods.mjs";
import { npcRollHandle } from "../../npc/methods/npc-roll-methods.mjs";

export const handlerEquipmentItemRollEvents = {
    [OnEventType.ADD]: async (item, event) => EquipmentSheetItemRollHandle.add(item, event),
    [OnEventType.EDIT]: async (item, event) => EquipmentSheetItemRollHandle.edit(item, event),
    [OnEventType.REMOVE]: async (item, event) => EquipmentSheetItemRollHandle.remove(item, event),
    [OnEventType.CHECK]: async (item, event) => EquipmentSheetItemRollHandle.check(item, event),
    [OnEventType.ROLL]: async (item, event) => EquipmentSheetItemRollHandle.roll(item, event),
    [OnEventType.CHAT]: async (item, event) => EquipmentSheetItemRollHandle.chat(item, event),
    [OnEventType.VIEW]: async (item, event) => EquipmentSheetItemRollHandle.view(item, event),
}

export async function rollByItemAndRollId(item, rollId) {
    await EquipmentSheetItemRollHandle.rollById(item, rollId);
}

class EquipmentSheetItemRollHandle {
    static async add(item, event) {
        const rollTest = this.#getItemRollTest(item, this.#getItemRollTestId(event));
        if (!rollTest) {
            NotificationsUtils._error("Erro ao carregar o teste");
            return;
        }
        RollTestUtils.createMacroByRollTestData(rollTest, { parentName: item.name, img: item.img });
    }

    static async edit(item, event) {
        const rollTest = this.#getItemRollTest(item, this.#getItemRollTestId(event));
        const onConfirm = async (newRollTest) => {
            const possibleTests = this.#getItemTests(item);
            possibleTests[possibleTests.indexOf(rollTest)] = newRollTest;
            await EquipmentUpdater.updateEquipment(item, EquipmentCharacteristicType.POSSIBLE_TESTS, possibleTests)
        }
        CreateRollableTestDialog._open(rollTest, onConfirm);
    }

    static async remove(item, event) {
        const rollId = this.#getItemRollTestId(event);
        const rollTest = this.#getItemRollTest(item, rollId);
        if (!rollTest) {
            return;
        }

        const possibleTests = this.#getItemTests(item);
        onArrayRemove(possibleTests, rollTest);

        const changes = [EquipmentUpdater.createChange(EquipmentCharacteristicType.POSSIBLE_TESTS, possibleTests)];

        const currentDefaultTestId = getObject(item, EquipmentCharacteristicType.DEFAULT_TEST);
        if (currentDefaultTestId == rollId) {
            let newDefaultTest = ''
            if (possibleTests.length > 0) {
                newDefaultTest = possibleTests[0].id;
            }

            changes.push(EquipmentUpdater.createChange(EquipmentCharacteristicType.DEFAULT_TEST, newDefaultTest));
        }

        await EquipmentUpdater.updateEquipmentData(item, changes);
    }

    static async check(item, event) {
        const rollId = this.#getItemRollTestId(event);
        const possibleTests = this.#getItemTests(item);

        const sortedTests = possibleTests.sort((a, b) => {
            if (a.id === rollId) {
                return -1
            } else if (b.id === rollId) {
                return 1
            } else {
                return a.name.localeCompare(b.name);
            }
        });

        const changes = [
            EquipmentUpdater.createChange(EquipmentCharacteristicType.DEFAULT_TEST, rollId),
            EquipmentUpdater.createChange(EquipmentCharacteristicType.POSSIBLE_TESTS, sortedTests)
        ];

        await EquipmentUpdater.updateEquipmentData(item, changes);
    }

    static async roll(item, event) {
        const dataset = event.currentTarget.dataset;
        const rollId = dataset.itemId;
        this.rollById(item, rollId, dataset.type == 'half');
    }

    static async rollById(item, rollId, divided) {
        const possibleTests = this.#getItemTests(item);
        const rollTest = possibleTests.find(test => test.id == rollId);
        if (!rollTest) {
            return;
        }

        const half = divided || false;
        const actor = item.actor;

        const mappedRollActor = {
            [ActorType.PLAYER]: async () => {
                await playerRollHandle.rollableItem(actor, rollTest, item, half);
            },
            [ActorType.NPC]: async () => {
                await npcRollHandle.rollableItem(actor, rollTest, item, half);
            },
        }

        const mappedMethod = mappedRollActor[actor?.type];
        if (typeof mappedMethod === 'function') {
            mappedMethod();
        }
    }

    static async chat(item, event) {
        TODO('enviar roll do item no chat');
    }

    static async view(item, event) {
        const rollTest = this.#getItemRollTest(item, this.#getItemRollTestId(event));
        if (!rollTest) {
            return;
        }
        CreateRollableTestDialog._view(rollTest);
    }

    static #getItemRollTestId(event) {
        return event.currentTarget.dataset.itemId;
    }

    static #getItemRollTest(item, rollId) {
        return this.#getItemTests(item).find(test => test.id == rollId);
    }

    static #getItemTests(item) {
        return [...getObject(item, EquipmentCharacteristicType.POSSIBLE_TESTS)] || [];
    }
}