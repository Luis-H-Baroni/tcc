import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { getWallet } from "./wallet.js";
export async function populateTransaction(transaction) {
  const wallet = await getWallet();

  const populatedTransaction = await wallet.populateTransaction(transaction);
  console.log("populated transaction", populatedTransaction);

  return populatedTransaction;
}

export async function signTransaction(populatedTransaction) {
  const wallet = await getWallet();

  const signedTransaction = await wallet.signTransaction(populatedTransaction);
  console.log("signed transaction", signedTransaction);

  return signedTransaction;
}

export function formatUnits(value, unit) {
  return ethers.formatUnits(value, unit);
}

export function generateHash(value){
  return ethers.keccak256(value)
}
