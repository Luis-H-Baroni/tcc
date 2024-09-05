import { formatUnits } from "./utils.js";
import { populateTransaction, signTransaction } from "./transactions.js";
import { getWallet } from "./wallet.js";

export async function handleSubmit(event) {
  event.preventDefault();

  const clickedButton = event.submitter;
  const wallet = await getWallet();

  console.log("clickedButton", clickedButton.value);

  const contractMethod = clickedButton.value;
  const publicKey = wallet.signingKey.publicKey;
  const documentHash = localStorage.getItem("documentHash");

  if (clickedButton.value === "storeHash") {
    const transaction = await fetch(
      "http://localhost:3000/transactions/build",
      {
        method: "POST",
        body: JSON.stringify({
          contractMethod: contractMethod,
          publicKey: publicKey,
          documentHash: documentHash,
        }),
        headers: {
          "Content-Type": "application/json",
        },
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
      <div class="label-field-row">
        <input type="checkbox" id="validateDiploma" name="validateDiploma" unchecked />
        <label for="validateDiploma">Verificar Conformidade do Diploma Digital junto ao MEC</label>
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
    const status = event.target.querySelector("#status").value;
    console.log("status", status);
    const transaction = await fetch(
      "http://localhost:3000/transactions/build",
      {
        method: "POST",
        body: JSON.stringify({
          contractMethod: contractMethod,
          publicKey: publicKey,
          documentHash: documentHash,
          status: status,
        }),
        headers: {
          "Content-Type": "application/json",
        },
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
      <div class="label-field-row">
        <input type="checkbox" id="validateDiploma" name="validateDiploma" unchecked />
        <label for="validateDiploma">Verificar Conformidade do Diploma Digital junto ao MEC</label>
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
