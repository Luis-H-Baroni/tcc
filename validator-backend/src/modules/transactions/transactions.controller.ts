import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { TransactionsService } from './transactions.service'

import { BuildContractTransactionDto } from 'src/dtos/build-contract-transaction.dto'
import { BroadcastContractTransactionDto } from 'src/dtos/broadcast-contract-transaction.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { broadcastContractTransactionSuccessTemplate } from 'src/views/broadcast-contract-transaction'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/build')
  @UseInterceptors(FileInterceptor('file'))
  async buildContractTransaction(
    @Body() payload: BuildContractTransactionDto,
    @UploadedFile() file,
  ) {
    try {
      return this.transactionsService.buildContractTransaction(
        payload.publicKey,
        payload.documentHash,
        payload.contractMethod,
        payload.validateDigitalDiploma,
        payload.status,
        file,
      )
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  @Post('/broadcast')
  async broadcastContractTransaction(@Body() payload: BroadcastContractTransactionDto) {
    try {
      const result = await this.transactionsService.broadcastContractTransaction(
        payload.transaction,
      )

      return broadcastContractTransactionSuccessTemplate(
        payload.documentHash,
        result.hash,
      )
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
