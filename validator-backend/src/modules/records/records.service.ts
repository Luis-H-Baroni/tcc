import { Injectable } from '@nestjs/common'
import { ethers } from 'ethers'
import { BlockchainService } from 'src/modules/blockchain/blockchain.service'
import { RecordDto } from 'src/dtos/record.dto'

@Injectable()
export class RecordsService {
  constructor(private blockchainService: BlockchainService) {}

  async getRecords(documentHash: string) {
    const records: RecordDto[] = await this.blockchainService.executeContractMethod(
      'getRecords',
      {
        documentHash,
      },
    )
    console.log('records', records)

    return records
  }

  async verifyOwnership(documentHash: string, publicKey: string) {
    const records: RecordDto[] = await this.getRecords(documentHash)

    const hashedPublicKey = ethers.keccak256(publicKey)

    for (const record of records) {
      if (record.publicKey === hashedPublicKey) return true
    }

    return false
  }
}
