import { Inject, Injectable } from '@nestjs/common'
import { Contract, ethers, Wallet } from 'ethers'

@Injectable()
export class BlockchainService {
  constructor(
    @Inject('ETHERS_PROVIDER')
    private readonly provider: ethers.JsonRpcProvider,
    @Inject('ETHERS_WALLET') private readonly wallet: Wallet,
    @Inject('ETHERS_CONTRACT') private readonly contract: Contract,
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
}
