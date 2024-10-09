export function verifyOwnershipTemplate(documentHash: string, publicKey: string) {
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
}

export function verifyOwnershipNotOwnerTemplate(documentHash: string, publicKey: string) {
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
}
