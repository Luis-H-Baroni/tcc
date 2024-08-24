import { generateHash, fileToBuffer } from "./utils.js";

export async function handleChange(event) {
  if (event.target.id === "file-upload") {
    const file = event.target.files[0];
    if (file) {
      const buffer = await fileToBuffer(file);
      const hash = generateHash(buffer);
      console.log("hash", hash);
      localStorage.setItem("documentHash", hash);

      document.getElementById("file-upload").outerHTML = file.name;
    }
  }
}
