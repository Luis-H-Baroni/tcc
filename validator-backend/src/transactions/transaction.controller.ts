import { Body, Controller, Post } from '@nestjs/common'
import { TransactionService } from './transaction.service'

import { BuildContractTransactionDto } from '../dtos/build-contract-transaction.dto'
import { BroadcastContractTransactionDto } from '../dtos/broadcast-contract-transaction.dto'

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/build')
  async buildContractTransaction(@Body() payload: BuildContractTransactionDto) {
    try {
      return this.transactionService.buildContractTransaction(
        payload.publicKey,
        payload.documentHash,
        payload.contractMethod,
      )
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  @Post('/broadcast')
  async broadcastContractTransaction(
    @Body() payload: BroadcastContractTransactionDto,
  ) {
    try {
      console.log(payload.transaction)
      const result = await this.transactionService.broadcastContractTransaction(
        payload.transaction,
      )

      return `
      <div class="label-field-section">
        <label>Documento Registrado</label>
                <div class="label-field">
                    <label for="document-hash">Hash do Documento</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value="0x123123" readonly>
                    </div>
                </div>
                <div class="label-field">
                    <label for="transaction-hash">Transação</label>
                    <div class="input-group">
                        <input type="text" id="transaction-hash" value=${result.hash} readonly>  
                    </div>
                </div>
      </div>
      `
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
