import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { VerifiedInstitution } from './verified-institutions.entity'
import { VerifiedInstitutionsService } from './verified-institutions.service'
import { CreateVerifiedInstitutionDto } from 'src/dtos/create-verified-institution.dto'
import { updatedVerifiedInstitutionTemplate } from 'src/views/update-verified-institution'

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

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() payload: CreateVerifiedInstitutionDto,
  ): Promise<string> {
    const updatedInstitution = await this.verifiedInstitutionsService.update(id, payload)
    return updatedVerifiedInstitutionTemplate(updatedInstitution)
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
