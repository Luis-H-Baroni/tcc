import { VerifiedInstitution } from 'src/modules/verified-institutions/verified-institutions.entity'

export function updatedVerifiedInstitutionTemplate(
  verifiedInstitution: VerifiedInstitution,
) {
  return `
    <div class="institution-details" id="institutionDetails">
      <input type="hidden" name="id" value="${verifiedInstitution.id}">
      <div class="label-field">
        <label for="public-key">Chave Pública</label>
        <div class="input-group">
          <input type="text" name="publicKey" id="public-key" value="${verifiedInstitution.publicKey}" readonly>
        </div>
      </div>
      <div class="label-field">
        <label for="institution-name">Nome da Instituição</label>
        <div class="input-group">
          <input type="text" name="name" id="institution-name" value="${verifiedInstitution.name}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-email">Email</label>
        <div class="input-group">
          <input type="text" name="email" id="institution-email" value="${verifiedInstitution.email}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-phone">Telefone</label>
        <div class="input-group">
          <input type="text" name="phone" id="institution-phone" value="${verifiedInstitution.phone}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-address">Endereço</label>
        <div class="input-group">
          <input type="text" name="address" id="institution-address" value="${verifiedInstitution.address}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-website">Website</label>
        <div class="input-group">
          <input type="text" name="website" id="institution-website" value="${verifiedInstitution.website}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-representative">Representante</label>
        <div class="input-group">
          <input type="text" name="representative" id="institution-representative" value="${verifiedInstitution.representative}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-representative-email">Email do Representante</label>
        <div class="input-group">
          <input type="text" name="representativeEmail" id="institution-representative-email" value="${verifiedInstitution.representativeEmail}" >
        </div>
      </div>
      <div class="label-field">
        <label for="institution-createdAt">Data de Criação</label>
        <div class="input-group">
          <input type="text" name="createdAt" id="institution-createdAt" value="${verifiedInstitution.createdAt}" readonly>
        </div>
      </div>
      <div class="label-field">
        <label for="institution-updatedAt">Data de Atualização</label>
        <div class="input-group">
          <input type="text" name="updatedAt" id="institution-updatedAt" value="${verifiedInstitution.updatedAt}" readonly>
        </div>
      </div>
      <div class="label-field">
        <label for="institution-verified">Verificado</label>
        <div class="input-group">
          <input type="text" name="verified" id="institution-verified" value="${verifiedInstitution.verified}" >
        </div>
      </div>
    </div>
  `
}
