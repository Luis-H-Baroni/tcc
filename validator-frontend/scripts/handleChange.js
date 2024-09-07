import { generateHash, fileToBuffer } from "./utils.js";
import { walletIsInitialized } from "./wallet.js";

let isFileUploaded = false;
let uploadedFile = null;

export async function handleChange(event) {
  isFileUploaded = false;
  if (event.target.id === "file-upload") {
    const file = event.target.files[0];
    if (file) {
      const buffer = await fileToBuffer(file);
      const hash = generateHash(buffer);
      console.log("hash", hash);
      localStorage.setItem("documentHash", hash);

      document.getElementById("file-upload").outerHTML = file.name;
      isFileUploaded = true;

      if (walletIsInitialized() && fileIsUploaded()) {
        document.getElementById("verify-hash").disabled = false;
        document.getElementById("store-hash").disabled = false;
        document.getElementById("verify-ownership").disabled = false;
      }

      uploadedFile = file;
    }
  }
}

export function fileIsUploaded() {
  return isFileUploaded;
}

export function getUploadedFile() {
  return uploadedFile;
}
