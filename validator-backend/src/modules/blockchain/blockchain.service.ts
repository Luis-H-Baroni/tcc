import { Inject, Injectable } from '@nestjs/common'
import { Contract, ethers, Wallet } from 'ethers'

@Injectable()
export class BlockchainService {
  constructor(
    @Inject('ETHERS_PROVIDER')
    private readonly provider: ethers.JsonRpcProvider,
    @Inject('ETHERS_WALLET') private readonly wallet: Wallet,
    @Inject('ETHERS_CONTRACT') private readonly contract: Contract,
    @Inject('ETHERS_INTERFACE') private readonly iface: ethers.Interface,
  ) {}

  async buildContractTransaction(contractMethod: string, transactionParams: any) {
    console.log('parâmetros da transação', transactionParams)
    console.log('método do contrato', contractMethod)

    try {
      const contractTransaction = await this.contract[contractMethod].populateTransaction(
        ...Object.values(transactionParams),
      )

      return contractTransaction
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async broadcastTransaction(signedTransaction: any) {
    try {
      return await this.provider.broadcastTransaction(signedTransaction)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async executeContractMethod(contractMethod: string, transactionParams: any) {
    console.log('metodo do contrato', contractMethod)
    console.log('parametros da transação', transactionParams)
    try {
      return await this.contract[contractMethod](...Object.values(transactionParams))
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async parseSignedTransaction(signedTransaction: string) {
    const transactionObject = ethers.Transaction.from(signedTransaction)
    console.log('tr', transactionObject)

    return transactionObject
  }

  async recoverSignerPublicKey(signedTransaction: string) {
    const transactionObject = await this.parseSignedTransaction(signedTransaction)

    const recoveredPublicKey = transactionObject.fromPublicKey
    console.log('recoveredPublicKey', recoveredPublicKey)
    if (recoveredPublicKey) return recoveredPublicKey

    const populatedTransaction = {
      chainId: transactionObject.chainId,
      data: transactionObject.data,
      gasLimit: transactionObject.gasLimit,
      maxFeePerGas: transactionObject.maxFeePerGas,
      maxPriorityFeePerGas: transactionObject.maxPriorityFeePerGas,
      nonce: transactionObject.nonce,
      to: transactionObject.to,
      type: transactionObject.type,
    }

    const txBytes = ethers.Transaction.from(populatedTransaction).unsignedSerialized

    const hashedPopulatedTransaction = ethers.keccak256(txBytes)

    const publicKey = ethers.SigningKey.recoverPublicKey(
      hashedPopulatedTransaction,
      transactionObject.signature,
    )
    console.log('fallback recoveredPublicKey', publicKey)

    return publicKey
  }

  async decodeContractTransactionData(data: string) {
    const decodedData = this.iface.parseTransaction({ data })
    console.log('decodedData', decodedData)
    return decodedData
  }
}
