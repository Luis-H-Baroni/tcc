export class MecDigitalDiplomaConformityResultDto {
  status: string
  verificationDate: string
  xsdVersion: string
  validatorVersion: string
  xsdVersionValidation: string
  compliances: {
    schema: string
    signatureReport: string
    signatureConformance: string
    fileIntegrity: string
    validationCode: string
  }

  constructor(report: any) {
    this.status = report.status || null
    this.verificationDate = report.verificationDate || null
    this.xsdVersion = report.xsdVersion || null
    this.validatorVersion = report.validatorVersion || null
    this.xsdVersionValidation = report.xsdVersionValidation.status || null

    this.compliances = {
      schema: report.schema.status || null,
      signatureReport: report.signatureReport.status || null,
      signatureConformance: report.signatureConformance.status || null,
      fileIntegrity: report.fileIntegrity.status || null,
      validationCode: report.validationCode.status || null,
    }
  }
}
