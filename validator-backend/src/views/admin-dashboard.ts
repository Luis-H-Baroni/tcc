import { VerifiedInstitution } from 'src/modules/verified-institutions/verified-institutions.entity'
import { institutionDetailsTemplate } from './institution-details'

export function getAdminDashboardTemplate(institutions: VerifiedInstitution[]) {
  return `
      <div class="dashboard" id="dashboard">
        <div class="dashboard-header" id="dashboard-header">
          <div class="dashboard-logout">
            <button class="btn" id="logout">Sair</button>
          </div>
          <div class="dashboard-title">
            <h1>Instituições</h1>
          </div>
          <div class="dashboard-placeholder">
            
          </div>
        </div>
        <div class="records">
          ${institutions.map(renderInstitution).join('')}
        </div>
      </div>
    `
}

function renderInstitution(institution: VerifiedInstitution) {
  return `
      <div class="institution-card" id="institutionCard">
        ${institutionDetailsTemplate(institution)}
        <div class="institution-actions">
          <button class="btn" hx-patch=/institutions/{{id}} hx-target="previous #institutionDetails" hx-include="closest .institution-card" hx-ext="path-params" hx-swap="outerHTML" id="update-institution">Atualizar</button>
          <button class="btn" hx-delete=/institutions/{{id}} hx-target="closest #institutionCard" hx-include="closest .institution-card" hx-ext="path-params" hx-swap="outerHTML" id="delete-institution">Deletar</button>
        </div>
      </div>
    `
}
