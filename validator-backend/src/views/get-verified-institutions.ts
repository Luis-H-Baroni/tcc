import { ethers } from 'ethers'
import { VerifiedInstitution } from 'src/modules/verified-institutions/verified-institutions.entity'

export function getVerifiedInstitutionsTemplate(institutions: VerifiedInstitution[]) {
  return `
    <div class="institutions-list" id="institutionsList">
        ${institutions.map(renderInstitution).join('')}
    </div>
  `
}

function formatTimestamp(timestamp: Date) {
  return new Date(timestamp).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
  })
}

function renderInstitution(institution: VerifiedInstitution) {
  return `
  <div class="horizontal-card">
                <div class="institution-presentation">
                  <h3>${institution.abbreviation}</h3>
                  <span>${institution.name}</span>
                </div>
                <div class="label-field">
                  <label for="public-key">Chave Pública</label>
                  <div class="input-group" id="public-key-input">
                    <input
                      type="text"
                      id="public-key"
                      value="${institution.publicKey}"
                      readonly=""
                    />
                    <button id="copy-btn" class="copy-btn">📋</button>
                  </div>
                  <label for="public-key">Hash da Chave Pública</label>
                  <div class="input-group" id="hash-public-key-input">
                    <input
                      type="text"
                      id="hash-public-key"
                      value="${ethers.id(institution.publicKey)}"
                      readonly=""
                    />
                    <button id="copy-btn" class="copy-btn">📋</button>
                  </div>
                </div>
                <button id="moreInfoBtn" class="more-info-btn" data-target="info${institution.id}">
                  &#x2139
                </button>
              </div>
              <div class="extra-info" id="info${institution.id}">
                <p>Email: ${institution.email}</p>
                <p>Telefone: ${institution.phone}</p>
                <p>Endereço: ${institution.address}</p>
                <p>Website: ${institution.website}</p>
                <p>Representante: ${institution.representative}</p>
                <p>Email do Representante: ${institution.representativeEmail}</p>
                <p>Data de Criação: ${formatTimestamp(institution.createdAt)}</p>
                <p>Data de Atualização: ${formatTimestamp(institution.updatedAt)}</p>
              </div>
              
              `
}
