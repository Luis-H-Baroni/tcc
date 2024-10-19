import { RecordDto } from 'src/dtos/record.dto'

function getStatus(status: number, type: 'status' | 'mecConformityStatus'): string {
  const statusMap = {
    status: {
      0: '<div class="status-input-group" id="valid-status"><span id="valid">VÁLIDO</span></div>',
      1: '<div class="status-input-group" id="invalid-status"><span id="invalid">INVÁLIDO</span></div>',
      2: '<div class="status-input-group" id="cancelled-status"><span id="cancelled">CANCELADO</span></div>',
    },
    mecConformityStatus: {
      0: '<div class="status-input-group" id="valid-status"><span id="valid">CONFORME</span></div>',
      1: '<div class="status-input-group" id="invalid-status"><span id="invalid">NÃO CONFORME</span></div>',
      2: '<div class="status-input-group" id="indeterminated-status"><span id="indeterminated">INDETERMINADO</span></div>',
      3: '<div class="status-input-group" id="null-status"><span id="null">-</span></div>',
    },
  }

  return statusMap[type][status]
}

function formatTimestamp(timestamp: string): string {
  return new Date(Number(timestamp) * 1000).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
  })
}

function renderRecord(record: RecordDto): string {
  const status = getStatus(Number(record.status), 'status')
  const mecConformityStatus = getStatus(
    Number(record.mecConformityStatus),
    'mecConformityStatus',
  )

  return `
    <div class="record">
      <div class="label-field">
        <div class="status-section">
          ${status}
          <span>Última atualização em ${formatTimestamp(record.statusUpdatedAt)}</span>
        </div>
        <div class="status-section">
          ${mecConformityStatus}
          <span>Última atualização em ${formatTimestamp(record.mecConformityStatusUpdatedAt)}</span>
        </div>

        <label for="document-hash">Hash Registrado</label>
        <div class="input-group">
          <input type="text" id="document-hash" value="${record.hash}" readonly>
        </div>

        <label for="owner-public-key">Hash da Chave Pública do Emissor</label>
        <div class="input-group">
          <input type="text" id="owner-public-key" value="${record.publicKey}" readonly>
        </div>

        <label for="created-at">Data do registro</label>
        <div class="input-group">
          <input type="text" id="created-at" value="${formatTimestamp(record.createdAt)}" readonly>
        </div>

      </div>
    </div>
  `
}

export function getRecordsTemplate(records: RecordDto[]): string {
  const recordsHtml = records.map(renderRecord).join('')

  return `
    <div class="label-field-section">
      <label>Registros Encontrados</label>
      ${recordsHtml}
      <div class="action-buttons">
        <button class="btn" id="return-to-selector">Voltar</button>
      </div>
    </div>
  `
}

export function getRecordsNotFoundTemplate(documentHash: string) {
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
}
