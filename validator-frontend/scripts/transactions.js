import { getWallet } from "./wallet.js";

export async function populateTransaction(transaction) {
  const wallet = await getWallet();

  try {
    const populatedTransaction = await wallet.populateTransaction(transaction);
    console.log("populated transaction", populatedTransaction);

    return populatedTransaction;
  } catch (error) {
    console.log(error);
    return { error: true, reason: error.reason };
  }
}

export async function signTransaction(populatedTransaction) {
  const wallet = await getWallet();

  const signedTransaction = await wallet.signTransaction(populatedTransaction);
  console.log("signed transaction", signedTransaction);

  return signedTransaction;
}
