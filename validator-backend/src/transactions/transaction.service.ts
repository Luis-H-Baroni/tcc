import { Contract, ethers, TransactionResponse, Wallet } from 'ethers'

import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RecordDto } from 'src/dtos/record.dto'
import { MecDigitalDiplomaService } from 'src/mec-digital-diploma/mec-digital-diploma.service'
import { MecConformityStatus } from 'src/enums'

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ETHERS_PROVIDER')
    private readonly provider: ethers.JsonRpcProvider,
    @Inject('ETHERS_WALLET') private readonly wallet: Wallet,
    @Inject('ETHERS_CONTRACT') private readonly contract: Contract,
    private readonly configService: ConfigService,
    private readonly mecDigitalDiplomaService: MecDigitalDiplomaService,
  ) {}

  async buildContractTransaction(
    publicKey: string,
    documentHash: string,
    contractMethod: string,
    validateDigitalDiploma: string,
    status?: number,
    file?: any,
  ) {
    const validMethods = this.configService.get('contract.methods')

    if (!validMethods.includes(contractMethod))
      throw new BadRequestException('Invalid contract method')

    const hashedPublicKey = ethers.keccak256(publicKey)
    const transactionParams = {
      documentHash,
      hashedPublicKey,
    }

    if (contractMethod === 'updateStatus') transactionParams['status'] = status

    if (this.parseBoolean(validateDigitalDiploma)) {
      const report = await this.mecDigitalDiplomaService.verifyDiploma(file)
      transactionParams['mecConformityStatus'] =
        MecConformityStatus[report.status]
    } else {
      transactionParams['mecConformityStatus'] = MecConformityStatus['NULL']
    }

    console.log('parametros da transação', transactionParams)
    const contractTransaction = await this.contract[
      contractMethod
    ].populateTransaction(...Object.values(transactionParams))

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
    const records: RecordDto[] = await this.contract.verifyHash(documentHash)
    console.log('records', records)

    return records
  }

  async verifyOwnership(documentHash: string, publicKey: string) {
    const records: RecordDto[] = await this.verifyHash(documentHash)

    const hashedPublicKey = ethers.keccak256(publicKey)

    for (const record of records) {
      if (record.publicKey === hashedPublicKey) return true
    }

    return false
  }

  private parseBoolean(value: string) {
    if (value === 'true') return true
    if (value === 'false') return false
    throw new BadRequestException('Invalid boolean value')
  }
}
