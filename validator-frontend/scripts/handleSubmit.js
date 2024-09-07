import { formatUnits } from "./utils.js";
import { populateTransaction, signTransaction } from "./transactions.js";
import { getWallet } from "./wallet.js";
import { getUploadedFile } from "./handleChange.js";
import { Status } from "./enums.js";

export async function handleSubmit(event) {
  event.preventDefault();

  const clickedButton = event.submitter;
  const wallet = await getWallet();

  console.log("clickedButton", clickedButton.value);

  const contractMethod = clickedButton.value;
  const publicKey = wallet.signingKey.publicKey;
  const documentHash = localStorage.getItem("documentHash");

  if (clickedButton.value === "confirmStoreHash") {
    const element = `
      <div class="label-field-section">
        <label>Registrar Documento</label>
                <div class="label-field">
                    <label for="document-hash">Hash do Documento</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value=${documentHash} readonly>
                    </div>
                </div>
                <div class="label-field">
                    <label for="owner-public-key">Chave Pública do Emissor</label>
                    <div class="input-group">
                        <input type="text" id="owner-public-key" value=${publicKey} readonly>
                    </div>
                </div>
                <div class="label-field-row">
                <input
                  type="checkbox"
                  id="validateDiploma"
                  name="validateDiploma"
                  unchecked
                />
                <label for="validateDiploma"
                  >Verificar Conformidade do Diploma Digital junto ao MEC</label
                >
              </div>
                <div class="action-buttons">
            <button class="btn" id="return-to-selector">Voltar</button>
            <button class="btn" type="submit" value="storeHash">Confirmar</button>
            
          </div>
                </div>`;
    document.getElementById("transactionSelector").innerHTML = element;
  }
  if (clickedButton.value === "storeHash") {
    const validateDiplomaCheckbox = document.getElementById("validateDiploma");
    const validateDigitalDiploma = validateDiplomaCheckbox
      ? validateDiplomaCheckbox.checked
      : false;

    const body = new FormData();

    body.append("contractMethod", contractMethod);
    body.append("publicKey", publicKey);
    body.append("documentHash", documentHash);
    body.append("validateDigitalDiploma", validateDigitalDiploma);

    if (validateDigitalDiploma) {
      const file = getUploadedFile();
      if (file) {
        body.append(
          "file",
          new Blob([file], { type: "application/octet-stream" })
        );
      }
    }
    for (var pair of body.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    const transaction = await fetch(
      "http://localhost:3000/transactions/build",
      {
        method: "POST",
        body: body,
      }
    ).then((response) => response.json());

    const populatedTransaction = await populateTransaction(transaction);

    const signedTransaction = await signTransaction(populatedTransaction);

    const element = `
    <form id="transactionBroadcast"
      hx-post="http://localhost:3000/transactions/broadcast"
      hx-swap="outerHTML"
      hx-include="[name='transaction']">
  
      <div class="label-field-section">
      <label>Registrar Documento</label>
      <div class="label-field">
        <label class="centered-label" for="fee">Taxa</label>
          <div class="row-section">
            <div class="fee-input-group">
                <input type="text" id="fee" value=${formatUnits(
                  populatedTransaction.maxFeePerGas *
                    populatedTransaction.gasLimit,
                  "gwei"
                )} readonly>
                <label for="fee">GWEI</label>
            </div>
            ~
            <div class="fee-input-group">
                <input type="text" id="fee" value=${formatUnits(
                  populatedTransaction.maxFeePerGas *
                    populatedTransaction.gasLimit,
                  "ether"
                )} readonly>
                <label for="fee">MATIC</label>
            </div>
          </div>
      </div>
  
      <div class="label-field">
        <label for="documentHash">Hash do Documento</label>
        <div class="input-group">
          <input type="text" id="documentHash" name="documentHash" value=${localStorage.getItem(
            "documentHash"
          )} readonly>
          </div>
      </div>
  
  
      <input type="hidden" id="transaction" name="transaction" value=${JSON.stringify(
        signedTransaction
      )} />
  
      <div class="action-buttons">
        <button class="btn" id="return-to-selector">Cancelar</button>
        <button class="btn" type="submit"/>Confirmar</button>
      </div>
    </div>
    </form>
  `;

    document.getElementById("bottomCard").innerHTML = element;
    htmx.process(document.getElementById("transactionBroadcast"));
  }

  if (clickedButton.value === "verifyHash") {
    const element = `
    <form id="verifyHash"
      hx-post="http://localhost:3000/transactions/verify"
      hx-swap="outerHTML"
      hx-include="[name='documentHash']">
  
      <div class="label-field-section">
      <label>Verificar Documento</label>
      
      
  
      <div class="label-field">
        <label for="documentHash">Hash do Documento</label>
        <div class="input-group">
          <input type="text" id="documentHash" name="documentHash" value=${localStorage.getItem(
            "documentHash"
          )} readonly>
          </div>
      </div>
  
  
  
      <div class="action-buttons">
        <button class="btn" id="return-to-selector">Cancelar</button>
        <button class="btn" type="submit"/>Confirmar</button>
      </div>
    </div>
    </form>
  `;

    document.getElementById("bottomCard").innerHTML = element;
    htmx.process(document.getElementById("verifyHash"));
  }

  if (clickedButton.value === "verifyOwnership") {
    const element = await fetch(
      "http://localhost:3000/transactions/verify-ownership",
      {
        method: "POST",
        body: JSON.stringify({
          publicKey: publicKey,
          documentHash: documentHash,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.text());

    document.getElementById("transactionSelector").innerHTML = element;
  }

  if (clickedButton.value === "updateStatus") {
    const validateDiplomaCheckbox = document.getElementById("validateDiploma");
    const validateDigitalDiploma = validateDiplomaCheckbox
      ? validateDiplomaCheckbox.checked
      : false;

    const status = Number(event.target.querySelector("#status").value);
    console.log("status", status);
    const body = new FormData();

    body.append("contractMethod", contractMethod);
    body.append("publicKey", publicKey);
    body.append("documentHash", documentHash);
    body.append("status", status);
    body.append("validateDigitalDiploma", validateDigitalDiploma);

    if (validateDigitalDiploma) {
      const file = getUploadedFile();
      if (file) {
        body.append(
          "file",
          new Blob([file], { type: "application/octet-stream" })
        );
      }
    }
    for (var pair of body.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    const transaction = await fetch(
      "http://localhost:3000/transactions/build",
      {
        method: "POST",
        body: body,
      }
    ).then((response) => response.json());

    const populatedTransaction = await populateTransaction(transaction);

    const signedTransaction = await signTransaction(populatedTransaction);

    const element = `
    <form id="transactionBroadcast"
      hx-post="http://localhost:3000/transactions/broadcast"
      hx-swap="outerHTML"
      hx-include="[name='transaction']">
  
      <div class="label-field-section">
      <label>Registrar Documento</label>
      <div class="label-field">
        <label class="centered-label" for="fee">Taxa</label>
          <div class="row-section">
            <div class="fee-input-group">
                <input type="text" id="fee" value=${formatUnits(
                  populatedTransaction.maxFeePerGas *
                    populatedTransaction.gasLimit,
                  "gwei"
                )} readonly>
                <label for="fee">GWEI</label>
            </div>
            ~
            <div class="fee-input-group">
                <input type="text" id="fee" value=${formatUnits(
                  populatedTransaction.maxFeePerGas *
                    populatedTransaction.gasLimit,
                  "ether"
                )} readonly>
                <label for="fee">ETH</label>
            </div>
          </div>
      </div>
  
      <div class="label-field">
        <label for="documentHash">Hash do Documento</label>
        <div class="input-group">
          <input type="text" id="documentHash" name="documentHash" value=${localStorage.getItem(
            "documentHash"
          )} readonly>
          </div>
      </div>
  
  
      <input type="hidden" id="transaction" name="transaction" value=${JSON.stringify(
        signedTransaction
      )} />
  
      <div class="action-buttons">
        <button class="btn" id="return-to-selector">Cancelar</button>
        <button class="btn" type="submit"/>Confirmar</button>
      </div>
    </div>
    </form>
  `;

    document.getElementById("bottomCard").innerHTML = element;
    htmx.process(document.getElementById("transactionBroadcast"));
  }
}
