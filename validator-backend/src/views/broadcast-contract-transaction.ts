export function broadcastContractTransactionSuccessTemplate(
  documentHash: string,
  hash: string,
) {
  return `
      <div class="label-field-section">
        <label>Sucesso</label>
                <div class="label-field">
                    <label for="document-hash">Hash do Documento</label>
                    <div class="input-group">
                        <input type="text" id="document-hash" value=${documentHash} readonly>
                    </div>
                </div>
                <div class="label-field">
                    <label for="transaction-hash">Transação</label>
                    <div class="input-group">
                        <input type="text" id="transaction-hash" value=${hash} readonly>  
                    </div>
                </div>

                <div class="action-buttons">
            <button class="btn" id="return-to-selector">Voltar</button>
            
          </div>
      </div>
      `
}
