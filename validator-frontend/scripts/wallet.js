import { ethers } from "../libs/ethers.min.js";

let wallet = null;

export async function randomMnemonicPhrase(transaction) {
  const mnemonic = await ethers.Wallet.createRandom().mnemonic;
  return mnemonic.phrase;
}

export async function initializeWallet(mnemonic) {
  const provider = await new ethers.JsonRpcProvider(
    "https://rpc-amoy.polygon.technology/"
    //"http://localhost:8545"
  );

  const testWallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );

  const testWallet2 = new ethers.Wallet(
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    provider
  );

  const testnetWallet = new ethers.Wallet(
    "0x63e09604c0edb1475c79ede29d8275563e610df5eced17f7cc0327f1c4482958",
    provider
  );

  wallet = await ethers.Wallet.fromPhrase(mnemonic, provider);
  //wallet = testnetWallet;

  console.log("wallet", wallet);
  return wallet;
}

export async function getWallet() {
  return wallet;
}

export function walletIsInitialized() {
  return wallet !== null;
}
