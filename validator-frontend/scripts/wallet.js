import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

let wallet = null;

export async function randomMnemonicPhrase(transaction) {
  const mnemonic = await ethers.Wallet.createRandom().mnemonic;
  return mnemonic.phrase;
}

export async function initializeWallet(mnemonic) {
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");

  const testWallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );

  //wallet = await ethers.Wallet.fromPhrase(mnemonic, provider);
  wallet = testWallet;
  console.log("wallet", wallet);
  return wallet;
}

export async function getWallet() {
  return wallet;
}
