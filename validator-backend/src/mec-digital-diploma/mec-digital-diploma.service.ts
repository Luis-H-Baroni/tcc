import { Injectable } from '@nestjs/common'
import FormData from 'form-data'
import fetch from 'node-fetch'
import { MecDigitalDiplomaConformityResultDto } from 'src/dtos/mec-digital-diploma-conformity-result.dto'

@Injectable()
export class MecDigitalDiplomaService {
  async verifyDiploma(file: any) {
    console.log(file)
    const formData = new FormData()

    formData.append('file', file.buffer, file.originalname)

    const report = await fetch(
      'https://verificadordiplomadigital.mec.gov.br/portal-validacao-api/diploma/v1/verify-diploma',
      {
        headers: formData.getHeaders(),
        body: formData,
        method: 'POST',
      },
    )
      .then((response) => response.json())
      .catch((error) => {
        console.log(error)
        throw error
      })

    console.log(report)

    const conformityReport = new MecDigitalDiplomaConformityResultDto(report)

    console.log(conformityReport)

    return conformityReport
  }
}
