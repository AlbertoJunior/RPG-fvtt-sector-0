import { createActorDataModels } from "../data/actor-data-model.mjs";
import { createEquipmentDataModels } from "../data/equipment-data-model.mjs";
import { createTraitDataModels } from "../data/trait-data-model.mjs";

export async function createDataModels() {
    const models = [
        { model: "Actor", method: createActorDataModels() },
        { model: "Trait", method: createTraitDataModels() },
        { model: "Equipment", method: createEquipmentDataModels() },
    ];

    const results = await Promise.all(
        models.map(({ model, method }) =>
            (async () => {
                try {
                    await method;
                    return { Model: model, Status: "Sucesso" };
                } catch (error) {
                    console.error(error);
                    return { Model: model, Status: "Falha" };
                }
            })()
        )
    );

    console.log('-> Todos os Models foram configurados!');
    console.table(results);
}