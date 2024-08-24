export function handleClick(event) {
  if (event.target.id === "return-to-selector") {
    document.getElementById("bottomCard").innerHTML = `
      <form id="transactionSelector">
        <div class="upload-section">
          <label for="file-upload">Insira seu arquivo</label>
          <input type="file" id="file-upload" />
          <div class="action-buttons">
            <button class="btn" type="submit" value="verifyHash">
              Verificar
            </button>
            <button class="btn" type="submit" value="storeHash">
              Registrar
            </button>
            <button class="btn" type="submit" value="atualizar">
              Atualizar
            </button>
          </div>
        </div>
      </form>`;
  }
}
