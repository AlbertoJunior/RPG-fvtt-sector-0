import { ActorUtils } from "../utils/actor.mjs";
import { TODO, toTitleCase } from "../utils/utils.mjs";

export async function rollAttribute(actor, params) {
    const { attr1, attr2, ability, specialist, difficulty } = params;

    const attrValue1 = ActorUtils.getAttributeValue(actor, attr1);
    const attrValue2 = ActorUtils.getAttributeValue(actor, attr2);
    const abilityValue = ActorUtils.getAbilityValue(actor, ability);
    const penalty = ActorUtils.calculatePenalty(actor);

    const diceAmount = calculateDiceAmount(attrValue1, attrValue2, abilityValue, penalty);
    const overloadDiceAmount = Math.min(actor.system.sobrecarga.atual || 0, diceAmount);

    const [rollOverloadResults, rollDefaultResults] = await Promise.all([
        rollDice(overloadDiceAmount),
        rollDice(Math.max(diceAmount - overloadDiceAmount, 0))
    ]);

    const diceResults = {
        overload: rollOverloadResults,
        default: rollDefaultResults
    };

    const attrs = {
        attr1: {
            label: attr1,
            value: attrValue1
        },
        attr2: {
            label: attr2,
            value: attrValue2
        },
    }

    const abilityInfo = {
        label: ability,
        value: abilityValue,
        specialist: specialist
    };

    return await mountContent(diceResults, attrs, abilityInfo, difficulty);
}

function calculateDiceAmount(attribute1, attribute2, ability, penalty) {
    const amount = Math.floor((attribute1 + attribute2) / 2) + ability;
    const finalAmount = Math.max(amount - penalty, 0);
    return finalAmount;
}

async function rollDice(amount) {
    if (amount > 0) {
        const rollFormula = `${amount}d10`;
        const roll = new Roll(rollFormula);
        await roll.evaluate();
        return roll.dice.map(dice => dice.results.map(result => result.result));
    }
    return [];
};

async function mountContent(diceResults, attrs, abilityInfo, difficulty) {
    //TODO: Colocar para carregar através de um arquivo .html ou .hbs
    TODO('roll.mjs:mountContent: Colocar para carregar através de um arquivo .html ou .hbs')

    const attr1 = attrs.attr1;
    const attr2 = attrs.attr2;

    const contentAbility = `<p><strong>Habilidade:</strong> ${toTitleCase(abilityInfo.label.replaceAll('_', ' '))}</p>`

    const contentTest = `<p><strong>Teste:</strong> (${attr1.value} + ${attr2.value}) / 2 + ${abilityInfo.value}</p>`;

    const formatDiceResults = (results, label, customStyle = '') => {
        if (results.length === 0) return '';
        const formattedResults = results[0]
            .map(result => `<li class="S0-d10 roll die d10" style="${customStyle}">${result}</li>`)
            .join("");
        return `
            <p><strong>${label}:</strong></p>
            <ol class="dice-rolls">${formattedResults}</ol>
        `;
    };
    const contentOverload = formatDiceResults(
        diceResults.overload, 'Sobrecarga', 'filter: sepia(0.5) hue-rotate(60deg);'
    );
    const contentRoll = formatDiceResults(diceResults.default, 'Rolagem');

    const result = verifyResultRoll(
        diceResults.overload, diceResults.default, abilityInfo.specialist, difficulty
    );

    const contentUsePerseverance = `
        <button class="S0-roll-result">Usar Perseverança</button>
    `;

    const contentResult = `
        <button class="S0-roll-result toggle-tooltip ${result.message.classes}">${result.message.message}</button>
    `;

    const contentFinal = `
     <div class="dice-tooltip tooltip-part hidden">
         ${contentAbility}
         ${contentTest}
         ${contentOverload}
         ${contentRoll}
         <label><strong>Sucessos</strong>: ${result.result + result.overload}
         ${contentUsePerseverance}
     </div>
     ${contentResult}
    `;

    const messageContent = `
    <h3>Teste de ${toTitleCase(attr1.label)} e ${toTitleCase(attr2.label)}</h3>
    ${contentFinal}
    `
    return messageContent;
}

function verifyResultRoll(dicesOverload, dicesDefault, specialist, difficulty) {
    const { result, overload } = calculateSuccess(dicesOverload, dicesDefault, specialist, difficulty);
    const message = mountResultMessageInfos(result, overload);
    return { result, overload, message };
}

function calculateSuccess(dicesOverload, dicesDefault, specialist, difficulty) {
    let resultOverload = 0;
    let overload = false;
    if (dicesOverload.length > 0) {
        dicesOverload[0].forEach(element => {
            if (element == 10) {
                resultOverload += 3;
                overload = true;
            } else if (element == 1) {
                resultOverload -= 3;
                overload = true;
            } else if (element >= difficulty) {
                resultOverload++;
            }
        });
    }

    let resultDefault = 0;
    let critic = 0;
    let usedSpecialist = !specialist;

    if (dicesDefault.length > 0) {
        dicesDefault[0].forEach(element => {
            if (element == 10) {
                critic++;
                resultDefault++;
            } else if (element == 1) {
                if (usedSpecialist) {
                    resultDefault--;
                } else {
                    usedSpecialist = true
                }
            } else if (element >= difficulty) {
                resultDefault++;
            }
        });
    }

    if (critic % 2 == 0) {
        critic--;
    }

    const resultFinal = resultOverload + resultDefault + Math.floor(critic / 2);

    return {
        result: resultFinal,
        overload: overload
    }
}

function mountResultMessageInfos(resultSuccess, haveOverload) {
    let messageInfo = ''
    if (resultSuccess > 0) {
        messageInfo = {
            message: haveOverload ? "SUCESSO EXPLOSIVO!" : "Sucesso",
            classes: haveOverload ? "overload success" : "success"
        }
    } else if (resultSuccess < 0) {
        messageInfo = {
            message: haveOverload ? "FALHA CAÓTICA" : "Falha Crítica",
            classes: haveOverload ? "overload critical-failure" : "critical-failure"
        }
    } else {
        messageInfo = {
            message: "Falha",
            classes: "failure"
        }
    }

    return messageInfo;
}