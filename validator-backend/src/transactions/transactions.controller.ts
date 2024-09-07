import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { TransactionsService } from './transactions.service'

import { BuildContractTransactionDto } from '../dtos/build-contract-transaction.dto'
import { BroadcastContractTransactionDto } from '../dtos/broadcast-contract-transaction.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/build')
  @UseInterceptors(FileInterceptor('file'))
  async buildContractTransaction(
    @Body() payload: BuildContractTransactionDto,
    @UploadedFile() file,
  ) {
    console.log('payload', payload)
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
      console.log(payload.transaction)
      const result = await this.transactionsService.broadcastContractTransaction(
        payload.transaction,
      )

      return `
      <div class="label-field-section">
        <label>Sucesso</label>
                <div class="label-field">
                    <label for="document-hash">Hash do Documento</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value=${payload.documentHash} readonly>
                    </div>
                </div>
                <div class="label-field">
                    <label for="transaction-hash">Transação</label>
                    <div class="input-group">
                        <input type="text" id="transaction-hash" value=${result.hash} readonly>  
                    </div>
                </div>

                <div class="action-buttons">
            <button class="btn" id="return-to-selector">Voltar</button>
            
          </div>
      </div>
      `
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
