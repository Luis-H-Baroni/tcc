import { VerifiedInstitution } from 'src/modules/verified-institutions/verified-institutions.entity'

export function institutionDetailsTemplate(institution: VerifiedInstitution) {
  return `
    <div class="institution-details" id="institutionDetails">
      <input type="hidden" name="id" value="${institution.id}">
      <input type="text" name="abbreviation" value="${institution.abbreviation}">
      <div class="label-field">
        <label for="public-key">Chave Pública</label>
        <div class="input-group">
          <input type="text" name="publicKey" id="public-key" value="${institution.publicKey}">
        </div>
      </div>
      <div class="label-field">
        <label for="institution-name">Nome da Instituição</label>
        <div class="input-group">
          <input type="text" name="name" id="institution-name" value="${institution.name}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-email">Email</label>
        <div class="input-group">
          <input type="text" name="email" id="institution-email" value="${institution.email}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-phone">Telefone</label>
        <div class="input-group">
          <input type="text" name="phone" id="institution-phone" value="${institution.phone}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-address">Endereço</label>
        <div class="input-group">
          <input type="text" name="address" id="institution-address" value="${institution.address}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-website">Website</label>
        <div class="input-group">
          <input type="text" name="website" id="institution-website" value="${institution.website}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-representative">Representante</label>
        <div class="input-group">
          <input type="text" name="representative" id="institution-representative" value="${institution.representative}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-representative-email">Email do Representante</label>
        <div class="input-group">
          <input type="text" name="representativeEmail" id="institution-representative-email" value="${institution.representativeEmail}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-createdAt">Data de Criação</label>
        <div class="input-group">
          <input type="text" name="createdAt" id="institution-createdAt" value="${institution.createdAt}" readonly>
        </div>
      </div>
      <div class="label-field">
        <label for="institution-updatedAt">Data de Atualização</label>
        <div class="input-group">
          <input type="text" name="updatedAt" id="institution-updatedAt" value="${institution.updatedAt}" readonly>
        </div>
      </div>
      <div class="label-field">
        <label for="institution-verified">Verificado</label>
        <div class="input-group">
          <input type="text" name="verified" id="institution-verified" value="${institution.verified}" >
        </div>
      </div>
    </div>
  `
}
