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
        payload.status,
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

  @Post('/verify')
  async verifyHash(@Body() payload: { documentHash: string }) {
    try {
      const records = await this.transactionService.verifyHash(
        payload.documentHash,
      )

      if (records.length === 0)
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
        <label>Registros Encontrados</label>
                ${records
                  .map(
                    (record) => `
                    <div class="record">
                    <div class="label-field">
                    <div class="row-section">
                    ${
                      record.valid
                        ? '<div class="status-input-group" id=valid-status> <span id="valid">VÁLIDO</span> </div>'
                        : '<div class="status-input-group" id=invalid-status> <span id="invalid">INVÁLIDO</span> </div>'
                    }
                    
                    </div>
                    <label for="document-hash">Hash Registrado</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value=${payload.documentHash} readonly>
                    </div>
                
                
                    <label for="owner-public-key">Hash da Chave Pública do Emissor</label>
                    <div class="input-group">
                        <input type="text" id="owner-public-key" value=${record.publicKey} readonly>
                    </div>
                    </div>
                    </div>
                    `,
                  )
                  .join('')}
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

  @Post('/verify-ownership')
  async verifyOwnership(
    @Body() payload: { documentHash: string; publicKey: string },
  ) {
    try {
      const isOwner = await this.transactionService.verifyOwnership(
        payload.documentHash,
        payload.publicKey,
      )
      console.log('é dono', isOwner)

      if (!isOwner)
        return `
      <div class="label-field-section">
        <label>Registro não Encontrado para sua Chave Pública</label>
                <div class="label-field">
                    <label for="document-hash">Hash do Documento</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value=${payload.documentHash} readonly>
                    </div>
                </div>
                <div class="label-field">
                    <label for="owner-public-key">Chave Pública do Emissor</label>
                    <div class="input-group">
                        <input type="text" id="owner-public-key" value=${payload.publicKey} readonly>
                    </div>
                </div>
                <div class="action-buttons">
            <button class="btn" id="return-to-selector">Voltar</button>
            
          </div>
                </div>`

      return `
      <div class="label-field-section">
        <label>Atualizar Status</label>
                <div class="label-field">
                    <label for="document-hash">Hash do Documento</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value=${payload.documentHash} readonly>
                    </div>
                </div>
                <div class="label-field">
                    <label for="owner-public-key">Chave Pública do Emissor</label>
                    <div class="input-group">
                        <input type="text" id="owner-public-key" value=${payload.publicKey} readonly>
                    </div>
                </div>
                <div class="label-field">
                    <label class="centered-label" for="status">Status</label>
                    <div class="row-section">
                    <div class="input-group">
                        <select id="status">
                            <option value="true">VÁLIDO</option>
                            <option value="false">INVÁLIDO</option>
                        </select>
                    </div>
                    </div>
                </div>
                <div class="action-buttons">
            <button class="btn" id="return-to-selector">Voltar</button>
            <button class="btn" type="submit" value="updateStatus">Atualizar Status</button>
            
          </div>
                </div>`
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
