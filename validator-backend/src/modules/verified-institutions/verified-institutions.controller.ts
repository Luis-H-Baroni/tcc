import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { VerifiedInstitution } from './verified-institutions.entity'
import { VerifiedInstitutionsService } from './verified-institutions.service'
import { CreateVerifiedInstitutionDto } from 'src/dtos/create-verified-institution.dto'

@Controller('verified-institutions')
export class VerifiedInstitutionsController {
  constructor(
    private readonly verifiedInstitutionsService: VerifiedInstitutionsService,
  ) {}

  @Post()
  async create(
    @Body() payload: CreateVerifiedInstitutionDto,
  ): Promise<VerifiedInstitution> {
    console.log('payload', payload)
    return await this.verifiedInstitutionsService.create(payload)
  }

  @Get()
  async findAll(): Promise<VerifiedInstitution[]> {
    return await this.verifiedInstitutionsService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<VerifiedInstitution> {
    return await this.verifiedInstitutionsService.findOne(id)
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.verifiedInstitutionsService.remove(id)
  }
}
