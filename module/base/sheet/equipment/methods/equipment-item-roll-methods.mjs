import { TODO } from "../../../../../scripts/utils/utils.mjs";
import { RollAttribute } from "../../../../core/rolls/attribute-roll.mjs";
import { CreateRollableTestDialog } from "../../../../creators/dialog/create-roll-test-dialog.mjs";
import { OnEventType } from "../../../../enums/on-event-type.mjs"
import { DefaultActions } from "../../../../utils/default-actions.mjs";

export const handlerEquipmentItemRollEvents = {
    [OnEventType.EDIT]: async (item, event) => EquipmentSheetItemRollHandle.edit(item, event),
    [OnEventType.REMOVE]: async (item, event) => EquipmentSheetItemRollHandle.remove(item, event),
    [OnEventType.CHECK]: async (item, event) => EquipmentSheetItemRollHandle.check(item, event),
    [OnEventType.ROLL]: async (item, event) => EquipmentSheetItemRollHandle.roll(item, event),
    [OnEventType.CHAT]: async (item, event) => EquipmentSheetItemRollHandle.chat(item, event),
    [OnEventType.VIEW]: async (item, event) => EquipmentSheetItemRollHandle.view(item, event),
}

class EquipmentSheetItemRollHandle {
    static async edit(item, event) {
        const rollTest = this.#getItemRollTest(item, this.#getItemRollTestId(event));
        const onConfirm = async (newRollTest) => {
            const possibleTests = this.#getItemTests(item);
            possibleTests[possibleTests.indexOf(rollTest)] = newRollTest;

            const characteristicToUpdate = {
                "system.possible_tests": possibleTests
            }
            await item.update(characteristicToUpdate);
        }
        CreateRollableTestDialog._open(rollTest, onConfirm);
    }

    static async remove(item, event) {
        const rollTest = this.#getItemRollTest(item, this.#getItemRollTestId(event));
        if (!rollTest) {
            return;
        }

        const possibleTests = this.#getItemTests(item);
        const indexToRemove = possibleTests.indexOf(rollTest);
        possibleTests.splice(indexToRemove, 1);

        const characteristicToUpdate = {
            "system.possible_tests": possibleTests
        }

        if (item.system.default_test == rollId) {
            characteristicToUpdate["system.default_test"] = '';
        }

        await item.update(characteristicToUpdate);
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

        const characteristicToUpdate = {
            "system.default_test": rollId,
            "system.possible_tests": sortedTests,
        }
        await item.update(characteristicToUpdate);
    }

    static async roll(item, event) {
        const rollId = event.currentTarget.dataset.itemId;
        const possibleTests = item.system.possible_tests || [];
        const rollTest = possibleTests.find(test => test.id == rollId);
        if (!rollTest) {
            return;
        }

        const resultRoll = await RollAttribute.rollByRollableTestsWithWeapon(item.actor, rollTest, item);
        DefaultActions.sendRollOnChat(item.actor, resultRoll, rollTest.difficulty, rollTest.name);
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
        return [...item.system.possible_tests] || [];
    }
}