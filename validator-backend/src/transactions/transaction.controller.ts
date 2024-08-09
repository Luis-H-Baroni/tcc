import { Body, Controller, Post } from '@nestjs/common'
import { TransactionService } from './transaction.service'

import { BuildContractTransactionDto } from '../dtos/build-contract-transaction.dto'
import { BroadcastContractTransactionDto } from '../dtos/broadcast-contract-transaction.dto'

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/build')
  async buildContractTransaction(@Body() payload: BuildContractTransactionDto) {
    return this.transactionService.buildContractTransaction(
      payload.publicKey,
      payload.documentHash,
      payload.contractMethod,
    )
  }

  @Post('/broadcast')
  async broadcastContractTransaction(
    @Body() payload: BroadcastContractTransactionDto,
  ) {
    return this.transactionService.broadcastContractTransaction(
      payload.transaction,
    )
  }
}
