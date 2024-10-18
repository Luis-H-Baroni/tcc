export function createInstitutionSuccessTemplate(abbreviation: string) {
  return `
    <div class="alert alert-success" role="alert">
      Pedido de verificação da instituição ${abbreviation} enviado com sucesso!
    </div>
  `
}
