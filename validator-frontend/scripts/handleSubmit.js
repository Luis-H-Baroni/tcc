import { formatUnits } from "./utils.js";
import { populateTransaction, signTransaction } from "./transactions.js";
import { getWallet } from "./wallet.js";
import { getUploadedFile } from "./handleChange.js";
import { environment } from "./environment.js";

export async function handleSubmit(event) {
  event.preventDefault();

  const clickedButton = event.submitter;
  const wallet = await getWallet();

  console.log("clickedButton", clickedButton.value);

  const contractMethod = clickedButton.value;
  const publicKey = wallet?.signingKey?.publicKey;
  const documentHash = localStorage.getItem("documentHash");

  if (clickedButton.value === "confirmStoreRecord") {
    const element = `
      <div class="label-field-section">
        <label>Registrar Documento</label>
                <div class="label-field">
                    <label for="document-hash">Hash do Documento</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value=${documentHash} readonly>
                        <button id="copy-btn" class="copy-btn">📋</button>
                    </div>
                </div>
                <div class="label-field">
                    <label for="owner-public-key">Chave Pública do Emissor</label>
                    <div class="input-group">
                        <input type="text" id="owner-public-key" value=${publicKey} readonly>
                        <button id="copy-btn" class="copy-btn">📋</button>
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
            <button class="btn" type="submit" value="storeRecord">Confirmar</button>
            
          </div>
                </div>`;
    document.getElementById("transactionSelector").innerHTML = element;
  }
  if (clickedButton.value === "storeRecord") {
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

    htmx.trigger("#transactionSelector", "htmx:xhr:loadstart");
    const transaction = await fetch(
      `${environment.BACKEND_URL}/transactions/build`,
      {
        method: "POST",
        body: body,
      }
    )
      .then((response) => {
        if (response.status === 500) {
          console.error("Error building transaction");
          throw new Error("Error building transaction");
        }
        return response.json();
      })
      .catch((error) => {
        htmx.trigger("#transactionSelector", "htmx:responseError");
        throw error;
      });

    const populatedTransaction = await populateTransaction(transaction);
    if (populatedTransaction.error) {
      if (
        populatedTransaction.reason ===
        "Document already registered for this public key"
      ) {
        document.getElementById("transactionSelector").innerHTML = `
        <div class="label-field-section">
          <label>Documento já registrado para essa Chave Pública</label>
          <div class="label-field">
            <label for="document-hash">Hash do Documento</label>
            <div class="input-group">
              <input type="text" id="document-hash" value=${documentHash} readonly>
              <button id="copy-btn" class="copy-btn">📋</button>
            </div>
          </div> 
          
          <div class="action-buttons">
            <button class="btn" id="return-to-selector">Voltar</button>
          </div>
        </div>
        `;
        throw new Error("Document already registered for this public key");
      }
      htmx.trigger("#transactionSelector", "htmx:responseError");
      throw new Error("Error populating transaction");
    }

    const signedTransaction = await signTransaction(populatedTransaction);

    const element = `
    <form id="transactionBroadcast"
      hx-post="${environment.BACKEND_URL}/transactions/broadcast"
      hx-swap="outerHTML"
      hx-include="[name='transaction']"
      hx-trigger="click from:#submitStore"
      >
      
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
          <button id="copy-btn" class="copy-btn">📋</button>
          </div>
      </div>
  
      <input type="hidden" id="transaction" name="transaction" value=${JSON.stringify(
        signedTransaction
      )} />
  
      <div class="action-buttons">
        <button class="btn" id="return-to-selector">Cancelar</button>
        <button class="btn" id="submitStore" type="submit"/>Confirmar</button>
      </div>
    </div>
    </form>
  `;

    document.getElementById("bottomCard").innerHTML = element;
    htmx.process(document.getElementById("transactionBroadcast"));
  }

  if (clickedButton.value === "getRecords") {
    const element = `
    <form id="getRecords"
      hx-get="${environment.BACKEND_URL}/records/${documentHash}"
      hx-swap="outerHTML"
      hx-params="none"
      hx-trigger="click from:#submitGetRecords"
      >
  
      <div class="label-field-section">
      <label>Verificar Documento</label>
      
      <div class="label-field">
        <label for="documentHash">Hash do Documento</label>
        <div class="input-group">
          <input type="text" id="documentHash" name="documentHash" value=${localStorage.getItem(
            "documentHash"
          )} readonly>
          <button id="copy-btn" class="copy-btn">📋</button>
          </div>
      </div>
  
      <div class="action-buttons">
        <button class="btn" id="return-to-selector">Cancelar</button>
        <button class="btn" type="submit" id="submitGetRecords" />Confirmar</button>
      </div>
    </div>
    </form>
  `;

    document.getElementById("bottomCard").innerHTML = element;
    htmx.process(document.getElementById("getRecords"));
  }

  if (clickedButton.value === "verifyOwnership") {
    htmx.trigger("#transactionSelector", "htmx:xhr:loadstart");
    const element = await fetch(
      `${environment.BACKEND_URL}/records/${documentHash}/ownership/${publicKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.status === 500) {
          console.error("Error getting ownership");
          throw new Error("Error getting ownership");
        }
        return response.text();
      })
      .catch((error) => {
        htmx.trigger("#transactionSelector", "htmx:responseError");
        throw error;
      });

    document.getElementById("transactionSelector").innerHTML = element;
  }

  if (clickedButton.value === "updateRecordStatus") {
    const validateDiplomaCheckbox = document.getElementById("validateDiploma");
    const validateDigitalDiploma = validateDiplomaCheckbox
      ? validateDiplomaCheckbox.checked
      : false;

    const status = Number(event.target.querySelector("#status").value);
    console.log("status from selector", status);
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

    htmx.trigger("#transactionSelector", "htmx:xhr:loadstart");
    const transaction = await fetch(
      `${environment.BACKEND_URL}/transactions/build`,
      {
        method: "POST",
        body: body,
      }
    )
      .then((response) => {
        if (response.status === 500) {
          console.error("Error building transaction");
          throw new Error("Error building transaction");
        }
        return response.json();
      })
      .catch((error) => {
        htmx.trigger("#transactionSelector", "htmx:responseError");
        throw error;
      });

    const populatedTransaction = await populateTransaction(transaction);

    const signedTransaction = await signTransaction(populatedTransaction);

    const element = `
    <form id="transactionBroadcast"
      hx-post="${environment.BACKEND_URL}/transactions/broadcast"
      hx-swap="outerHTML"
      hx-include="[name='transaction']"
      hx-trigger="click from:#submitUpdate"
      >
  
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
                <label for="fee">POL</label>
            </div>
          </div>
      </div>
  
      <div class="label-field">
        <label for="documentHash">Hash do Documento</label>
        <div class="input-group">
          <input type="text" id="documentHash" name="documentHash" value=${localStorage.getItem(
            "documentHash"
          )} readonly>
          <button id="copy-btn" class="copy-btn">📋</button>
          </div>
      </div>
  
  
      <input type="hidden" id="transaction" name="transaction" value=${JSON.stringify(
        signedTransaction
      )} />
  
      <div class="action-buttons">
        <button class="btn" id="return-to-selector">Cancelar</button>
        <button class="btn" type="submit" id="submitUpdate"/>Confirmar</button>
      </div>
    </div>
    </form>
  `;

    document.getElementById("bottomCard").innerHTML = element;
    htmx.process(document.getElementById("transactionBroadcast"));
  }
}
