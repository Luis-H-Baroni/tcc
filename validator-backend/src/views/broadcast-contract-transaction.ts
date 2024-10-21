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
                        <button id="copy-btn" class="copy-btn">📋</button>
                    </div>
                </div>
                <div class="label-field">
                    <label for="transaction-hash">Transação</label>
                    <div class="input-group">
                        <input type="text" id="transaction-hash" value=${hash} readonly>
                        <button id="copy-btn" class="copy-btn">📋</button>  
                    </div>
                </div>

                <div class="action-buttons">
            <button class="btn" id="return-to-selector">Voltar</button>
            <a href="${process.env.EXPLORER_URL}/${hash}" target="_blank" class="btn btn-primary">Ver no explorador</a>
            
          </div>
      </div>
      `
}

export function broadcastContractTransactionInsufficientFundsTemplate() {
  return `
    <div class="error">
        <img src="./assets/funds.svg" />
        <p>Saldo insuficiente</p>
        <p>A carteira não possui saldo suficiente para realizar a transação.</p>
        <div class="action-buttons">
            <button class="btn" id="return-to-selector">Voltar</button>
        </div>
    </div>
  `
}
