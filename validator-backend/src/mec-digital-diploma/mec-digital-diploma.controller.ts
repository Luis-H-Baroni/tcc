import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { MecDigitalDiplomaService } from './mec-digital-diploma.service'

@Controller('mec-digital-diploma')
export class MecDigitalDiplomaController {
  constructor(private mecDigitalDiplomaService: MecDigitalDiplomaService) {}

  @Post('/verify')
  @UseInterceptors(FileInterceptor('file'))
  async verifyDiploma(@UploadedFile() file) {
    console.log(file)

    try {
      return this.mecDigitalDiplomaService.verifyDiploma(file)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
