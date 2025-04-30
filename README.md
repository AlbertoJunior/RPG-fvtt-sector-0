# Setor 0 RPG para o Foundry VTT
![Foundry v12](https://img.shields.io/badge/foundry-v12-green)

Aqui esta o sistema oficial do Setor 0 para ser utilizado no FoundryVtt.

## Funcionalidades
### Idiomas suportados
* Português
* English [WIP]

### Personagem
* Aprimoramentos com efeitos passivos e ativos.
* Sistema de inventário com mochila e itens equipados.
* Transacionar itens entre personagens [WIP].
* Importar personagem do site [WIP].
* Calculo de XP e pontos utilizados [WIP].

### Sistemas
* Bônus de Nível 6 [WIP].
* Aprimoramentos.
* Traços Bons e Ruins.
* Inventário.
* Atalhos customizados por Personagem.
* Atalhos customizados por Equipamento.
* Rolagens considerando as penalidades e todos os bônus.
* SuperEquipamentos [WIP].
* Aliados e Informantes [WIP].

### Efeitos
* Efeitos ativos baseado em Aprimoramentos.
* Efeitos ativos baseado em Traços [WIP].
* Efeitos ativos baseado em Equipamentos [WIP].
* Efeitos ativos que não são passivos e acionados durante um combate são desativados automaticamente ao final do combate.

### Rolagens
* Atributos + Habilidade.
* Virtudes.
* Sobrecarga.
* Vida.
* Iniciativa.
* Perseverança pela mensagem do chat.
* Rolagem pelo Equipamento.

### Macros
O Setor 0 conta com um sistema de Macros pré-definidos para novos jogadores. Todo novo jogador recebe em sua Hotbar 3 macros iniciais, dois deles servem para abrir a ficha do Personagem em uma página específica, como a da mochila ou dos atalhos, o terceiro serve para realizar um teste de Sobrecarga, que é comum no sistema.
* Macros iniciais pré-configurados para novos jogadores.
* Compendium de Macros para Mestres e Jogadores.
* Funções padrão para criar novos Macros
<details>
  <summary>Métodos Globais para Macros</summary>
  
  ```mjs
  global.MacroMethods {
     overload: async (actor) => {
        // recebe um Actor e executa uma rolagem de Sobrecarga (enviando no chat)
     },
     customs: {
        rollable: async (actor, rollTestId) => {
            // recebe um Actor e um id referente a um RollTestData e realiza a rolagem (enviando no chat)
        }
     }
  }
  ```
</details>

<details>
    <summary>Como usar os métodos</summary>
    Ao criar o commando do macro, utilize o seguinte código:

    ```mjs
    global.MacroMethods.rollable(actor, rollId);
    ```

    Um Exemplo de uso real:

    ```js
    const selectedToken = canvas.tokens.controlled[0];
    if (!selectedToken) {
    ui.notifications.warn("Selecione um token primeiro.");
    return;
    }

    const actor = selectedToken.actor;
    if(!actor?.sheet.canRollOrEdit) {
    ui.notifications.warn("Sem permissão para esse personagem.");
    return;
    }

    await globalThis.MacroMethods.customs.rollable({actor, id: "642750db952e4aed87227edcf74bc05e"});
    ```
</details>

### UI
<details>
- Tema escuro para fichas de Personagens [WIP].
- Botões compactos na ficha de Personagem.
- Tradução de alguns elementos do Foundry.
</details>

## Telas
<details>
    <summary>Ficha de Personagem</summary>
    ![](imgs/screenshots/sheet-unedit-page1.jpeg)
    ![](imgs/screenshots/sheet-inedit-page1.jpeg)
    ![](imgs/screenshots/sheet-enhancements.jpeg)
    ![](imgs/screenshots/sheet-bag.jpeg)
</details>

<details>
    <summary>Ficha de Equipamento</summary>
    ![](imgs/screenshots/add_equipment.jpeg)
    ![](imgs/screenshots/sheet-equipment_edit_and_add_roll.jpeg)
</details>

<details>
  <summary>Rolagens</summary>
  ![](imgs/screenshots/roll_attribute.png)
  ![](imgs/screenshots/roll_virtue.png)
</details>