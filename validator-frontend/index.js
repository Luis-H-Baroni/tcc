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
