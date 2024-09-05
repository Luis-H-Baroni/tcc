import { fileIsUploaded } from "./handleChange.js";
import { generateHash } from "./utils.js";
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
      <p>${mnemonicPhrase}</p>
      <button id="continueNewWallet">Continuar</button>
    `;
  } else if (
    button.id === "existingWallet" ||
    button.id === "continueNewWallet"
  ) {
    console.log("Carteira Existente");

    document.getElementById("initializeWallet").innerHTML = `
      <label for="mnemonicPhrase">Mnemonic Phrase</label><br />

      <input type="text" id="mnemonicPhrase" name="mnemonicPhrase" /><br />
      <button id="continueExistingWallet">Continuar</button>
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

    document.getElementById("initializeWallet").innerHTML = `
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
                  <input type="text" id="hash-public-key" value=${generateHash(
                    wallet.signingKey.publicKey
                  )} readonly>
                  <button id="copy-btn" class="copy-btn">📋</button>
              </div>
          </div>
          <div class="label-field">
              <label for="address">Seu endereço</label>
              <div class="input-group">
                  <input type="text" id="address" value=${
                    wallet.address
                  } readonly>
                  <button id="copy-btn" class="copy-btn">📋</button>
              </div>
          </div>
      </div>
    `;
  }
}
