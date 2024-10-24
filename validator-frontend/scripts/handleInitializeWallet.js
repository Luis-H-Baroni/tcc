import { environment } from "./environment.js";
import { fileIsUploaded } from "./handleChange.js";
import { generateHashFromUtf8 } from "./utils.js";
import {
  randomMnemonicPhrase,
  initializeWallet,
  getWallet,
  walletIsInitialized,
} from "./wallet.js";

export async function handleInitializeWallet(event) {
  const button = event.target;

  if (button.id === "newWallet") {
    const mnemonicPhrase = await randomMnemonicPhrase();
    console.log(mnemonicPhrase);

    document.getElementById("initializeWallet").innerHTML = `
      <div class="label-field-section">
        <div class="label-field" id="phraseField">
          <div class="disclaimer">
            <p>
              Anote as palavras abaixo e guarde-as em um local seguro. Elas são
              a única forma de recuperar sua carteira.
            </p>
          </div>
              
          <div class="input-group">
            <textarea class="phrase" id="mnemonicPhrase" readonly>${mnemonicPhrase}</textarea>
            <button id="copy-btn" class="copy-btn">📋</button>
          </div>
        <div class="action-buttons">
          <button class="btn" id="continueNewWallet">Continuar</button>
        </div>
      </div>
    `;
  } else if (
    button.id === "existingWallet" ||
    button.id === "continueNewWallet"
  ) {
    console.log("Carteira Existente");

    document.getElementById("initializeWallet").innerHTML = `
      <div class="label-field-section">
        <div class="label-field" id="phraseField">
          <label for="mnemonicPhrase">Insira aqui o seu conjunto de palavras</label>
          <div class="input-group">
            <textarea class="phrase" id="mnemonicPhrase"></textarea>
          </div>
        <div class="action-buttons">
          <button class="btn" id="continueExistingWallet">Continuar</button>
        </div>
      `;
  } else if (button.id === "continueExistingWallet") {
    const mnemonicPhrase = document.getElementById("mnemonicPhrase").value;
    console.log(mnemonicPhrase);

    await initializeWallet(mnemonicPhrase);

    const wallet = await getWallet();

    if (walletIsInitialized() && fileIsUploaded()) {
      document.getElementById("verify-hash").disabled = false;
      document.getElementById("store-hash").disabled = false;
      document.getElementById("verify-ownership").disabled = false;
    }

    document.getElementById("initializeSection").innerHTML = `
      <div class="label-field-section">
          <div class="label-field">
              <label for="public-key">Sua chave pública</label>
              <div class="input-group" id="public-key-input">
                  <input type="text" id="public-key" value=${
                    wallet.signingKey.publicKey
                  } readonly>
                  <button id="copy-btn" class="copy-btn">📋</button>
              </div>
              <label for="public-key">Hash da chave pública</label>
              <div class="input-group" id="hash-public-key-input">
                  <input type="text" id="hash-public-key" value=${generateHashFromUtf8(
                    wallet.signingKey.publicKey
                  )} readonly>
                  <button id="copy-btn" class="copy-btn">📋</button>
              </div>
          </div>
          <div class="label-field">
              <label for="address">Seu endereço</label>
              <div class="input-group">
                  <a href="${environment.EXPLORER_URL}/address/${
      wallet.address
    }" target="_blank">${wallet.address}</a>
                  <input type="text" hidden="true" id="address" value="${
                    wallet.address
                  }" readonly>
                  <button id="copy-btn" class="copy-btn">📋</button>
              </div>
          </div>
      </div>
    `;
  }
}
