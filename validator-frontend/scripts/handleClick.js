export function handleClick(event) {
  if (event.target.id === "return-to-selector") {
    document.getElementById("bottomCard").innerHTML = `
      <form id="transactionSelector">
        <div class="upload-section">
          <label for="file-upload">Insira seu arquivo</label>
          <input type="file" id="file-upload" />
          <div class="action-buttons">
            <button class="btn" id="verify-hash" type="submit" value="verifyHash" disabled>
              Verificar
            </button>
            <button class="btn" id="store-hash" type="submit" value="confirmStoreHash" disabled>
              Registrar
            </button>
            <button class="btn" id="verify-ownership" type="submit" value="verifyOwnership" disabled>
              Atualizar
            </button>
          </div>
        </div>
      </form>`;
  }

  if (event.target.id === "copy-btn") {
    const copyText = event.target.previousElementSibling.value;
    console.log(copyText);
    navigator.clipboard.writeText(copyText);
  }
}
