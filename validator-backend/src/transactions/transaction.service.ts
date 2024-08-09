import { Contract, ethers, Wallet } from 'ethers'

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ETHERS_PROVIDER')
    private readonly provider: ethers.JsonRpcProvider,
    @Inject('ETHERS_WALLET') private readonly wallet: Wallet,
    @Inject('ETHERS_CONTRACT') private readonly contract: Contract,
    private readonly configService: ConfigService,
  ) {}

  async buildContractTransaction(
    publicKey: string,
    documentHash: string,
    contractMethod: string,
  ) {
    const validMethods = this.configService.get('contract.methods')

    if (!validMethods.includes(contractMethod))
      throw new BadRequestException('Invalid contract method')

    try {
      const hashedPublicKey = ethers.keccak256(publicKey)

      const contractTransaction = await this.contract[
        contractMethod
      ].populateTransaction(documentHash, hashedPublicKey)

      console.log(this.wallet.signingKey.publicKey)
      const transaction =
        await this.wallet.populateTransaction(contractTransaction)
      const signedTransaction = await this.wallet.signTransaction(transaction)

      return signedTransaction
    } catch (error: any) {
      console.log(error)
      throw new InternalServerErrorException(error.shortMessage)
    }
  }

  async broadcastContractTransaction(transaction: string) {
    try {
      return await this.provider.broadcastTransaction(transaction)
    } catch (error: any) {
      console.log(error)
      throw new InternalServerErrorException(error.shortMessage)
    }
  }
}
