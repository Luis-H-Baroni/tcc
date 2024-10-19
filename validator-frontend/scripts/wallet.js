import { ethers } from "../libs/ethers.min.js";
import { environment } from "./environment.js";

let wallet = null;

export async function randomMnemonicPhrase() {
  const mnemonic = await ethers.Wallet.createRandom().mnemonic;
  return mnemonic.phrase;
}

export async function initializeWallet(mnemonic) {
  const provider = new ethers.JsonRpcProvider(environment.PROVIDER_URL);

  wallet = await ethers.Wallet.fromPhrase(mnemonic, provider);

  console.log("wallet", wallet);
  return wallet;
}

export async function getWallet() {
  return wallet;
}

export function walletIsInitialized() {
  return wallet !== null;
}
