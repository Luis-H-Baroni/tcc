import { Controller, Get, Param } from '@nestjs/common'
import { RecordsService } from './records.service'
import { getRecordsNotFoundTemplate, getRecordsTemplate } from 'src/views/get-records'
import {
  verifyOwnershipNotOwnerTemplate,
  verifyOwnershipTemplate,
} from 'src/views/verify-ownership'

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get('/:documentHash')
  async getRecords(@Param('documentHash') documentHash: string) {
    try {
      const records = await this.recordsService.getRecords(documentHash)

      if (records.length === 0) return getRecordsNotFoundTemplate(documentHash)

      return getRecordsTemplate(records)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  @Get('/:documentHash/ownership/:publicKey')
  async verifyOwnership(
    @Param('documentHash') documentHash: string,
    @Param('publicKey') publicKey: string,
  ) {
    try {
      const isOwner = await this.recordsService.verifyOwnership(documentHash, publicKey)
      console.log('é dono', isOwner)

      if (!isOwner) return verifyOwnershipNotOwnerTemplate(documentHash, publicKey)

      return verifyOwnershipTemplate(documentHash, publicKey)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
