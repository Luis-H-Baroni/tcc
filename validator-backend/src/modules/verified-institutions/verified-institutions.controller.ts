import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { VerifiedInstitution } from './verified-institutions.entity'
import { VerifiedInstitutionsService } from './verified-institutions.service'
import { CreateVerifiedInstitutionDto } from 'src/dtos/create-verified-institution.dto'
import { getVerifiedInstitutionsTemplate } from 'src/views/get-verified-institutions'
import { institutionDetailsTemplate } from 'src/views/institution-details'
import { AuthGuard } from '../auth/auth.guard'
import { createInstitutionSuccessTemplate } from 'src/views/create-institution'

@Controller('institutions')
export class VerifiedInstitutionsController {
  constructor(
    private readonly verifiedInstitutionsService: VerifiedInstitutionsService,
  ) {}

  @Post()
  async create(@Body() payload: CreateVerifiedInstitutionDto): Promise<string> {
    console.log('payload', payload)
    const createdInstitution = await this.verifiedInstitutionsService.create(payload)
    return createInstitutionSuccessTemplate(createdInstitution.abbreviation)
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @Body() payload: CreateVerifiedInstitutionDto,
  ): Promise<string> {
    console.log('updating institution', id, payload)
    const updatedInstitution = await this.verifiedInstitutionsService.update(id, payload)
    return institutionDetailsTemplate(updatedInstitution)
  }

  @Get('verified')
  async getVerifiedInstitutions(): Promise<string> {
    const verifiedInstitutions = await this.verifiedInstitutionsService.findAllVerified()
    return getVerifiedInstitutionsTemplate(verifiedInstitutions)
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number): Promise<VerifiedInstitution> {
    return await this.verifiedInstitutionsService.findOne(id)
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return await this.verifiedInstitutionsService.remove(id)
  }
}
