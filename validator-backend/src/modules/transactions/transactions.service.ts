import { ethers, TransactionResponse } from 'ethers'
import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MecDigitalDiplomaService } from 'src/modules/mec-digital-diploma/mec-digital-diploma.service'
import { MecConformityStatus } from 'src/enums'
import { BlockchainService } from 'src/modules/blockchain/blockchain.service'

@Injectable()
export class TransactionsService {
  constructor(
    private readonly blockchainService: BlockchainService,
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

    if (contractMethod === 'updateRecordStatus') transactionParams['status'] = status

    if (this.parseBoolean(validateDigitalDiploma)) {
      const report = await this.mecDigitalDiplomaService.verifyDiploma(file)
      transactionParams['mecConformityStatus'] = MecConformityStatus[report.status]
    } else {
      transactionParams['mecConformityStatus'] = MecConformityStatus['NULL']
    }

    const contractTransaction = await this.blockchainService.buildContractTransaction(
      contractMethod,
      transactionParams,
    )

    return contractTransaction
  }

  async broadcastContractTransaction(signedTransaction: string) {
    const transactionObject =
      await this.blockchainService.parseSignedTransaction(signedTransaction)

    const decodedData = await this.blockchainService.decodeContractTransactionData(
      transactionObject.data,
    )

    if (decodedData.name === 'storeRecord' || decodedData.name === 'updateRecordStatus') {
      const recoveredPublicKey =
        await this.blockchainService.recoverSignerPublicKey(signedTransaction)

      const hashedRecoveredPublicKey = ethers.keccak256(recoveredPublicKey)

      console.log('comparing hashed public keys', hashedRecoveredPublicKey)
      if (!decodedData.args.includes(hashedRecoveredPublicKey)) {
        throw new BadRequestException('Public key does not match')
      }
    }

    const broadcastedTransaction: TransactionResponse =
      await this.blockchainService.broadcastTransaction(signedTransaction)

    const result = await broadcastedTransaction.wait()
    if (!result.status) throw new ServiceUnavailableException('Transaction failed')

    console.log(result)
    return result
  }

  async verifySenderPublicKey(senderPublicKey: string, signedTransaction: string) {
    const recoveredPublicKey =
      await this.blockchainService.recoverSignerPublicKey(signedTransaction)

    return recoveredPublicKey === senderPublicKey
  }

  private parseBoolean(value: string) {
    if (value === 'true') return true
    if (value === 'false') return false
    throw new BadRequestException('Invalid boolean value')
  }
}
