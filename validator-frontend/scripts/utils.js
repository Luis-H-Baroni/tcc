import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

export function formatUnits(value, unit) {
  return ethers.formatUnits(value, unit);
}

export function generateHashFromBytesLike(value) {
  return ethers.keccak256(value);
}

export function generateHashFromUtf8(value) {
  return ethers.id(value);
}

export async function fileToBuffer(file) {
  const arrayBuffer = await fileToArrayBuffer(file);
  const byteArray = new Uint8Array(arrayBuffer);

  return byteArray;
}

function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
