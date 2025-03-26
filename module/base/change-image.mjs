export class ChangeImage {
  static async _change(actor) {
    const imageUrl = actor.img;

    const content = `
          <div>
            <label for="newImage"><strong>URL da nova imagem:</strong></label>
            <input type="text" id="newImage" value="${imageUrl}" style="margin-block: 4px">
          </div>
        `;

    return new Promise(resolve => {
      new Dialog({
        title: "Alterar Imagem do Personagem",
        content: content,
        buttons: {
          cancel: {
            label: "Cancelar"
          },
          change: {
            label: "Alterar",
            callback: (html) => {
              const newImage = html.find('#newImage').val();
              resolve(actor.update({ img: newImage }));
            }
          }
        }
      }).render(true);
    });
  }
}