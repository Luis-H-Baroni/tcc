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

  @Post('/verify')
  async verifyHash(@Body() payload: { documentHash: string }) {
    try {
      const { exists, valid, ownerPublicKey } =
        await this.transactionService.verifyHash(payload.documentHash)

      if (!exists)
        return `
      <div class="label-field-section">
        <label>Registro Não Encontrado</label>
                <div class="label-field">
                    <label for="document-hash">Hash Buscado</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value=${payload.documentHash} readonly>
                        
                        </div>
                        </div>
                        <div class="action-buttons">
            <button class="btn" id="return-to-selector">Voltar</button>
            
          </div>
                        </div>`

      return `
      <div class="label-field-section">
        <label>Registrado Encontrado</label>
                <div class="label-field">
                    <div class="input-group">
                        ${valid ? '<input type="text" id="valid" value="Valido" readonly>' : '<input type="text" id="invalid" value="Invalido" readonly>'}
                    </div>
                    <label for="document-hash">Hash Registrado</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value=${payload.documentHash} readonly>
                    </div>
                </div>
                <div class="label-field">
                    <label for="owner-public-key">Hash da Chave Pública do Emissor</label>
                    <div class="input-group">
                        <input type="text" id="owner-public-key" value=${ownerPublicKey} readonly>
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
