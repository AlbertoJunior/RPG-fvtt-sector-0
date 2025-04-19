export class AbilityRepository {
    static #characteristics = [
        { id: 'armas_brancas', label: 'S0.Armas_Brancas' },
        { id: 'armas_de_projecao', label: 'S0.Armas_De_Projecao' },
        { id: 'atletismo', label: 'S0.Atletismo' },
        { id: 'briga', label: 'S0.Briga' },
        { id: 'engenharia', label: 'S0.Engenharia' },
        { id: 'expressao', label: 'S0.Expressao' },
        { id: 'furtividade', label: 'S0.Furtividade' },
        { id: 'hacking', label: 'S0.Hacking' },
        { id: 'investigacao', label: 'S0.Investigacao' },
        { id: 'medicina', label: 'S0.Medicina' },
        { id: 'manha', label: 'S0.Manha' },
        { id: 'performance', label: 'S0.Performance' },
        { id: 'pilotagem', label: 'S0.Pilotagem' },
        { id: 'quimica', label: 'S0.Quimica' },
    ];

    static _getItems() {
        return [... this.#characteristics];
    }
}