import { getWallet } from "./wallet.js";
import { ethers } from "../libs/ethers.min.js";

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
