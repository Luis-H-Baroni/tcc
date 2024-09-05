import { generateHash, fileToBuffer } from "./utils.js";
import { walletIsInitialized } from "./wallet.js";

let uploadedFile = false;

export async function handleChange(event) {
  uploadedFile = false;
  if (event.target.id === "file-upload") {
    const file = event.target.files[0];
    if (file) {
      const buffer = await fileToBuffer(file);
      const hash = generateHash(buffer);
      console.log("hash", hash);
      localStorage.setItem("documentHash", hash);

      document.getElementById("file-upload").outerHTML = file.name;
      uploadedFile = true;

      if (walletIsInitialized() && fileIsUploaded()) {
        document.getElementById("verify-hash").disabled = false;
        document.getElementById("store-hash").disabled = false;
        document.getElementById("verify-ownership").disabled = false;
      }
    }
  }
}

export function fileIsUploaded() {
  return uploadedFile;
}
