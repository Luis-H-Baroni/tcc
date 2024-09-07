import { Controller, Get, Param } from '@nestjs/common'
import { RecordsService } from './records.service'

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get('/:documentHash')
  async getRecords(@Param('documentHash') documentHash: string) {
    try {
      const records = await this.recordsService.getRecords(documentHash)

      if (records.length === 0)
        return `
          <div class="label-field-section">
            <label>Registro Não Encontrado</label>
              <div class="label-field">
                <label for="document-hash">Hash Buscado</label>
                <div class="input-group">
                  <input type="text" id="document-hash" value=${documentHash} readonly>
                            
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
                  .map((record) => {
                    console.log(Number(record.status))
                    let status
                    let mecConformityStatus

                    switch (Number(record.status)) {
                      case 0:
                        status =
                          '<div class="status-input-group" id=valid-status> <span id="valid">VÁLIDO</span> </div>'
                        break
                      case 1:
                        status =
                          '<div class="status-input-group" id=invalid-status> <span id="invalid">INVÁLIDO</span> </div>'

                      default:
                        break
                    }

                    switch (Number(record.mecConformityStatus)) {
                      case 0:
                        mecConformityStatus =
                          '<div class="status-input-group" id=valid-status> <span id="valid">CONFORME</span> </div>'
                        break
                      case 1:
                        mecConformityStatus =
                          '<div class="status-input-group" id=invalid-status> <span id="invalid">NÃO CONFORME</span> </div>'

                      default:
                        break
                    }
                    return `
                    <div class="record">
                    <div class="label-field">
                    <div class="row-section">
                    ${status}
                    </div>
                    <div class="row-section">
                    ${mecConformityStatus}
                    </div>
                    <label for="document-hash">Hash Registrado</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value=${record.hash} readonly>
                    </div>
                
                
                    <label for="owner-public-key">Hash da Chave Pública do Emissor</label>
                    <div class="input-group">
                        <input type="text" id="owner-public-key" value=${record.publicKey} readonly>
                    </div>
                    </div>
                    </div>
                    `
                  })
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

  @Get('/:documentHash/ownership/:publicKey')
  async verifyOwnership(
    @Param('documentHash') documentHash: string,
    @Param('publicKey') publicKey: string,
  ) {
    try {
      const isOwner = await this.recordsService.verifyOwnership(documentHash, publicKey)
      console.log('é dono', isOwner)

      if (!isOwner)
        return `
      <div class="label-field-section">
        <label>Registro não Encontrado para sua Chave Pública</label>
                <div class="label-field">
                    <label for="document-hash">Hash do Documento</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value=${documentHash} readonly>
                    </div>
                </div>
                <div class="label-field">
                    <label for="owner-public-key">Chave Pública do Emissor</label>
                    <div class="input-group">
                        <input type="text" id="owner-public-key" value=${publicKey} readonly>
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
                        <input type="text" id="document-hash" value=${documentHash} readonly>
                    </div>
                </div>
                <div class="label-field">
                    <label for="owner-public-key">Chave Pública do Emissor</label>
                    <div class="input-group">
                        <input type="text" id="owner-public-key" value=${publicKey} readonly>
                    </div>
                </div>
                <div class="label-field">
                    <label class="centered-label" for="status">Status</label>
                    <div class="row-section">
                    <div class="input-group">
                        <select id="status">
                            <option value="0">VÁLIDO</option>
                            <option value="1">INVÁLIDO</option>
                            <option value="2">CANCELADO</option>
                        </select>
                    </div>
                    </div>
                </div>
                <div class="label-field-row">
                <input
                  type="checkbox"
                  id="validateDiploma"
                  name="validateDiploma"
                  unchecked
                />
                <label for="validateDiploma"
                  >Verificar Conformidade do Diploma Digital junto ao MEC</label
                >
              </div>
                <div class="action-buttons">
            <button class="btn" id="return-to-selector">Voltar</button>
            <button class="btn" type="submit" value="updateRecordStatus">Atualizar Status</button>
            
          </div>
                </div>`
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
