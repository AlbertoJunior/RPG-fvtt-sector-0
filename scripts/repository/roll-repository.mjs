import { GameSettingsUtils } from "../../module/settings/game-settings.mjs";

export class RollRepository {
    static _ROLL_HISTORY = "rollHistory";
    static _CONFIG = {
        name: "Histórico de Rolagens",
        scope: "world",  // Armazenar no mundo, para persistência entre as sessões
        config: false,    // Não precisa ser visível nas configurações do jogo
        type: Array,      // O tipo de dado será um array de objetos
        default: [],      // Valor padrão (inicialmente vazio)
        onChange: (value) => {
            console.log("Histórico de rolagens atualizado:", value);
        }
    }

    static testMethods() {
        // Exemplo de como adicionar uma rolagem
        const rollData = {
            default: [12, 15, 18],      // Rolagens feitas
            overload: [20, 25],         // Rolagens de sobrecarga
            difficulty: 18,             // Dificuldade da rolagem
            result: "Sucesso Crítico!"  // Resultado da rolagem
        };
        this.clear()

        const actorId = "1234567890abcdef";  // ID do ator
        this.addRoll(actorId, rollData);

        // Listar todas as rolagens  
        this.listRoll();

        // Buscar rolagens de um ator específico
        this.getRollsByActorId(actorId);

        // Apagar uma rolagem específica (exemplo: apagar a primeira rolagem)
        this.removeRoll(actorId, 0);
    }

    static clear() {
        GameSettingsUtils.set(this._ROLL_HISTORY, []);
    }

    static addRoll(actorId, messageId, rollInformation) {
        // Recuperar o histórico de rolagens
        const rollHistoryArray = GameSettingsUtils.get(this._ROLL_HISTORY);

        // Criar o novo objeto de rolagem
        const newRoll = {
            actorId: actorId,
            messageId: messageId,
            roll: rollInformation
        };

        // Adicionar a nova rolagem ao histórico
        rollHistoryArray.push(newRoll);

        // Salvar o histórico atualizado no game.settings
        GameSettingsUtils.set(this._ROLL_HISTORY, rollHistoryArray);

        console.log("Nova rolagem adicionada:", newRoll);
    }

    static listRoll() {
        // Recuperar o histórico de rolagens
        const rollHistory = GameSettingsUtils.get(this._ROLL_HISTORY);
        console.log("Histórico de rolagens:", rollHistory);
        return rollHistory;
    }

    static removeRoll(actorId, rollIndex) {
        // Recuperar o histórico de rolagens
        let rollHistoryArray = GameSettingsUtils.get(this._ROLL_HISTORY);

        // Filtrar a rolagem a ser excluída
        rollHistoryArray = rollHistoryArray.filter((roll, index) => index !== rollIndex);

        // Atualizar o histórico com a rolagem removida
        GameSettingsUtils.set(this._ROLL_HISTORY, rollHistoryArray);

        console.log(`Rolagem do ator ${actorId} no índice ${rollIndex} foi apagada.`);
    }

    static getRollsByActorId(actorId) {
        // Recuperar o histórico de rolagens
        const rollHistory = GameSettingsUtils.get(this._ROLL_HISTORY);

        // Filtrar as rolagens pelo actorId
        const actorRolls = rollHistory.filter(roll => roll.actorId === actorId);
        console.log(`Rolagens do ator ${actorId}:`, actorRolls);
        return actorRolls;
    }
}