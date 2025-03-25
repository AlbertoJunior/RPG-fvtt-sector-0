import { toTitleCase } from "./utils.mjs";

export async function rollAttribute(actor, attr1, attr2, ability, specialist, difficulty) {
    const system = actor.system;
    const attrValue1 = system.atributos[attr1] || 0;
    const attrValue2 = system.atributos[attr2] || 0;
    const abilityValue = system.habilidades[ability] || 0;
    const penalty = calculatePenalty(actor);

    const diceAmount = calculateDiceAmount(attrValue1, attrValue2, abilityValue, penalty);
    const overloadDiceAmount = Math.min(system.sobrecarga.value || 0, diceAmount);

    const rollDice = async (amount) => {
        if (amount > 0) {
            const rollFormula = `${amount}d10`;
            const roll = new Roll(rollFormula);
            await roll.evaluate();
            return roll.dice.map(dice => dice.results.map(result => result.result));
        }
        return [];
    };

    const rollOverloadResults = await rollDice(overloadDiceAmount);
    const rollDefaultResults = await rollDice(Math.max(diceAmount - overloadDiceAmount, 0));

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

    const messageData = mountMessage(diceResults, attrs, abilityInfo, difficulty);
    ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        content: messageData
    });
}

function calculatePenalty(actor) {
    const system = actor.system;
    const stamina = system.atributos.vigor;
    const damage = system.vitalidade.max - system.vitalidade.value;
    const calculatedMinor = Math.max(damage - stamina, 0);
    return Math.min(calculatedMinor, 4);
}

export function calculateDiceAmount(attribute1, attribute2, ability, penalty) {
    const amount = Math.floor((attribute1 + attribute2) / 2) + ability;
    const finalAmount = Math.max(amount - penalty, 0);
    return finalAmount;
}

function mountMessage(diceResults, attrs, abilityInfo, difficulty) {
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
        <button class="S0-roll-result toggle-tooltip ${result.classes}">Resultado: ${result.message}</button>
    `;

    const contentFinal = `
     <div class="dice-tooltip tooltip-part hidden">
         ${contentAbility}
         ${contentTest}
         ${contentOverload}
         ${contentRoll}
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

export function verifyResultRoll(dicesOverload, dicesDefault, specialist, difficulty) {
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
            console.log(`elemento: ${element}`)
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
    const final = resultOverload + resultDefault + Math.floor(critic / 2);

    let result = ''
    if (final > 0) {
        result = {
            message: overload ? "SUCESSO EXPLOSIVO!" : "Sucesso",
            classes: overload ? "overload success" : "success"
        }
    } else if (final < 0) {
        result = {
            message: overload ? "FALHA CAÓTICA" : "Falha Crítica",
            classes: overload ? "overload critical-failure" : "critical-failure"
        }
    } else {
        result = {
            message: "Falha",
            classes: "failure"
        }
    }

    return result;
}