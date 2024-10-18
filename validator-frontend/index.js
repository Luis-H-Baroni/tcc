import { handleChange } from "./scripts/handleChange.js";
import { handleSubmit } from "./scripts/handleSubmit.js";
import { handleClick } from "./scripts/handleClick.js";
import { handleInitializeWallet } from "./scripts/handleInitializeWallet.js";

document
  .getElementById("initializeWallet")
  .addEventListener("click", handleInitializeWallet);

document.addEventListener("submit", handleSubmit);

document.addEventListener("click", handleClick);

document.addEventListener("change", handleChange);

document.addEventListener("DOMContentLoaded", function () {
  const institutionsModal = document.getElementById("institutionsModal");
  const openInstitutionsModalBtn = document.getElementById(
    "openInstitutionsModal"
  );
  const closeInstitutionsModalBtn =
    document.getElementById("closeInstitutions");

  openInstitutionsModalBtn.onclick = function () {
    institutionsModal.style.display = "flex";
  };

  closeInstitutionsModalBtn.onclick = function () {
    institutionsModal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target === institutionsModal) {
      institutionsModal.style.display = "none";
    }
    if (event.target === requestModal) {
      requestModal.style.display = "none";
    }
  };

  const requestModal = document.getElementById("requestModal");
  const openRequestModalBtn = document.getElementById("openRequestModal");
  const closeRequestModalBtn = document.getElementById("closeRequest");

  openRequestModalBtn.onclick = function () {
    requestModal.style.display = "flex";
  };

  closeRequestModalBtn.onclick = function () {
    requestModal.style.display = "none";
  };
});

document.addEventListener("htmx:xhr:loadstart", function (event) {
  console.log("loadstart element", event.detail.elt.id);
  document.getElementById(event.detail.elt.id).innerHTML =
    '<img id="loading" class="loading" src="./assets/loading.svg" />';
});

document.addEventListener("htmx:responseError", function (event) {
  console.log("response error", event);
  document.getElementById(event.detail.elt.id).innerHTML = `
  <div class="error">
    <img src="./assets/error.svg" />
    <p>Erro ao realizar a operação</p>
    <p>Tente novamente mais tarde ou entre em contato com o administrador.</p>
    <div class="action-buttons">
      <button class="btn" id="return-to-selector">Voltar</button>
    </div>
  </div>
  
  `;
});
