# Contribuindo para o Setor 0

Olá, e obrigado por se interessar em contribuir com o sistema `Setor 0 - O Submundo` para o Foundry VTT!

Este é um projeto com direitos autorais protegidos e licença personalizada.  
Isso significa que nem tudo pode ser modificado ou redistribuído livremente, mas contribuições são **muito bem-vindas**, desde que feitas com responsabilidade e com nossa autorização prévia.

---

## 🧠 O que você pode fazer

- Reportar bugs ou comportamentos estranhos.
- Sugerir novas funcionalidades ou ajustes no sistema.
- Criar issues para discutir melhorias ou ideias.
- Criar pull requests com correções ou melhorias **mas serão avaliados e até discutidos previamente antes de serem aprovados ou recusados.**

---

## 🚫 O que você **não** deve fazer

- Criar forks públicos do sistema com alterações significativas sem autorização.
- Redistribuir, publicar ou modificar o sistema em outro repositório.
- Usar o conteúdo (como regras, ambientação ou imagens) para criar outro sistema derivado.

---

## ✅ Como contribuir (passo a passo)

1. [Abra uma issue](https://github.com/AlbertoJunior/RPG-fvtt-sector-0/issues) com o que deseja relatar ou sugerir.
2. Aguarde o feedback. Se aprovado, você pode:
   - Enviar um pull request com a melhoria.
   - Ou continuar a discussão para alinhar melhor a proposta.
3. Siga os padrões de código e mantenha o estilo do projeto.
4. Sempre teste sua contribuição antes de enviar!

---

## 🛠️ Estrutura e Ferramentas de Desenvolvimento
Se você pretende contribuir com o código, aqui estão alguns pontos importantes:

### Estrutura de Pastas
<details>
   <summary>module</summary>

   * module/ – Contém todos os códigos referentes ao sistema.
   * module/base – Scripts referentes as fichas (sheet) e atualizações (updater) dos elementos.
   * module/core – Scripts referentes as lógicas do sistema, rolagens, aprimoramentos, efeitos, combate e tudo que precise de lógica.
   * * Modificações em configurações do Foundry normalmente são feitas nesses arquivos, como o combate e token.
   * module/creators – São scripts que servem como utilitários para construção de elemementos, geralmente HBS (HTML).
   * module/enums – Enums que são muito utilizados para referênciar as caracterísiticas dos elementos (Tipos, Atributos, Efeitos...).
   * module/hooks – Todo gerênciamento que envolve Hooks deve ser feito aqui, criando arquivos específicos para cada coisa, como o 'init', 'ready', 'createItem' e outros.
   * module/repository – Tudo que for referente a busca de arquivos e documentos devem estar nessa pasta.
   * module/utils – Qualquer classe utilitária que seja genérica.
</details>

<details>
   <summary>lang</summary>

   * lang/ – Contém os arquivos de tradução para os idiomas
</details>

<details>
   <summary>styles</summary>

   * styles/ – Estilos CSS ou elementos de fonte utilizados na interface.
</details>

<details>
   <summary>templates</summary>

   * templates/ – Todos os elementos .hbs ou .html devem estar nessa pasta, separado em subpasta por tema.
</details>

### Padrões
O projeto segue as boas práticas do `Clean Code`, com foco em reduzir repetições de código (seguindo o princípio `DRY - Don't Repeat Yourself`) e mantendo a separação de responsabilidades de forma clara, organizando o código em arquivos específicos, evitando exposições desnecessárias.

Esse padrão é aplicado de forma consistente em várias partes do projeto. Seja ao atualizar elementos do personagem, criar `dialogs`, exibir mensagens no chat ou até mesmo nas rolagens de dados, é fácil identificar trechos de código responsáveis por ações específicas, como `add`, `remove`, `roll`, `open`, etc.

O principal objetivo é garantir que a manutenção do código seja **simples e eficiente**, com o mínimo de impacto possível em outros arquivos ao realizar alterações.

Um exemplo desse padrão em ação é o uso do script `getObject` (localizado em `utils`). Esse script é responsável por recuperar elementos do sistema Foundry, como a ficha do personagem. O `getObject` é utilizado em conjunto com um enum que representa a característica desejada. Com esse padrão, é possível modificar os nomes das características no DataModel do personagem sem precisar alterar os arquivos de código em múltiplos lugares. Basta ajustar o enum e o próprio DataModel, com exceção apenas para os arquivos .hbs (template de interface).

```mjs
static async handleAdd(actor, event) {
   export const CharacteristicType = Object.freeze({
      SHORTCUTS: {
         id: 'atalhos',
         system: 'system.atalhos',
      },
   });
   ...
   const onConfirm = async (rollable) => {
      if (!rollable.name) {
            NotificationsUtils._error("O Teste precisa de um nome");
            return;
      }

      const current = getObject(actor, CharacteristicType.SHORTCUTS) || [];
      current.push(rollable);

      await ActorUpdater._verifyAndUpdateActor(actor, CharacteristicType.SHORTCUTS, current);
   };

   CreateRollableTestDialog._open(null, onConfirm);
}
```

---

## ❤️ Agradecimento

Mesmo com todas as restrições, agradecemos profundamente cada pessoa que contribui, reporta ou compartilha o sistema. O `Setor 0` é feito com carinho (e um pouco de loucura), e toda ajuda é bem-vinda — desde que respeitando os limites do Domo.

---

Qualquer dúvida, nos procure via [https://setor0rpg.com.br](https://setor0rpg.com.br) ou abra uma issue.