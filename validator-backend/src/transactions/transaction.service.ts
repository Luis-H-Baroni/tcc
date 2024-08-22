import { Contract, ethers, TransactionResponse, Wallet } from 'ethers'

import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
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

    const hashedPublicKey = ethers.keccak256(publicKey)

    const contractTransaction = await this.contract[
      contractMethod
    ].populateTransaction(documentHash, hashedPublicKey)

    console.log(this.wallet.signingKey.publicKey)

    return contractTransaction
  }

  async broadcastContractTransaction(signedTransaction: string) {
    const broadcastedTransaction: TransactionResponse =
      await this.provider.broadcastTransaction(signedTransaction)

    const result = await broadcastedTransaction.wait()
    if (!result.status)
      throw new ServiceUnavailableException('Transaction failed')

    console.log(result)
    return result
  }

  async verifyHash(documentHash: string) {
    const [exists, valid, ownerPublicKey] =
      await this.contract.verifyHash(documentHash)
    console.log(exists, ownerPublicKey)
    return { exists, valid, ownerPublicKey }
  }
}
