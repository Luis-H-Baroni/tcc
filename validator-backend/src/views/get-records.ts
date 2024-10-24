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

function getTimestamp(timestamp: string): string {
  const numberTimestamp = Number(timestamp)

  if (numberTimestamp === 0) return `<span> - </span>`

  return `<span>Última atualização em ${formatTimestamp(numberTimestamp)}</span>`
}

function formatTimestamp(timestamp: number): string {
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
  const statusUpdatedAt = getTimestamp(record.statusUpdatedAt)
  const mecConformityStatusUpdatedAt = getTimestamp(record.mecConformityStatusUpdatedAt)

  return `
    <div class="record">
      <div class="label-field">
        <div class="status-section">
          <span id="statusLabel">Status</span>
          ${status}
          ${statusUpdatedAt}
        </div>
        <div class="status-section">
          <span id="statusLabel">Conformidade MEC</span>
          ${mecConformityStatus}
          ${mecConformityStatusUpdatedAt}
        </div>

        <label for="document-hash">Hash Registrado</label>
        <div class="input-group">
          <input type="text" id="document-hash" value="${record.hash}" readonly>
          <button id="copy-btn" class="copy-btn">📋</button>
        </div>

        <label for="owner-public-key">Hash da Chave Pública do Emissor</label>
        <div class="input-group">
          <input type="text" id="owner-public-key" value="${record.publicKey}" readonly>
          <button id="copy-btn" class="copy-btn">📋</button>
        </div>

        <label for="created-at">Data do registro</label>
        <div class="input-group">
          <input type="text" id="created-at" value="${formatTimestamp(Number(record.createdAt))}" readonly>
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
            <button id="copy-btn" class="copy-btn">📋</button>          
          </div>
        </div>
      <div class="action-buttons">
        <button class="btn" id="return-to-selector">Voltar</button> 
      </div>
    </div>`
}
