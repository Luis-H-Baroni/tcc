import { environment } from "./environment.js";

export async function handleClick(event) {
  if (event.target.id === "return-to-selector") {
    document.getElementById("bottomCard").innerHTML = `
      <form id="transactionSelector">
        <div class="upload-section">
          <label for="file-upload">Insira seu arquivo</label>
          <input type="file" id="file-upload" />
          <div class="action-buttons">
            <button class="btn" id="verify-hash" type="submit" value="getRecords" disabled>
              Verificar
            </button>
            <button class="btn" id="store-hash" type="submit" value="confirmStoreRecord" disabled>
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

  if (event.target.id === "openInstitutionsModal") {
    const element = await fetch(
      `${environment.BACKEND_URL}/institutions/verified`
    );

    document.getElementById("institutionsList").outerHTML =
      await element.text();
  }

  if (event.target.id === "moreInfoBtn") {
    const targetId = event.target.getAttribute("data-target");
    const extraInfo = document.getElementById(targetId);
    if (extraInfo.style.display === "none" || extraInfo.style.display === "") {
      extraInfo.style.display = "block";
    } else {
      extraInfo.style.display = "none";
    }
  }
}
