import { InjectRepository } from '@nestjs/typeorm'
import { VerifiedInstitution } from './verified-institutions.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { CreateVerifiedInstitutionDto } from 'src/dtos/create-verified-institution.dto'

@Injectable()
export class VerifiedInstitutionsService {
  constructor(
    @InjectRepository(VerifiedInstitution)
    private readonly verifiedInstitutionsRepository: Repository<VerifiedInstitution>,
  ) {}

  async create(
    verifiedInstitution: CreateVerifiedInstitutionDto,
  ): Promise<VerifiedInstitution> {
    const createdAt = new Date()
    return this.verifiedInstitutionsRepository.save({ ...verifiedInstitution, createdAt })
  }

  async update(verifiedInstitution: VerifiedInstitution): Promise<VerifiedInstitution> {
    return this.verifiedInstitutionsRepository.save(verifiedInstitution)
  }

  async findAll(): Promise<VerifiedInstitution[]> {
    return this.verifiedInstitutionsRepository.find()
  }

  async findOne(id: number): Promise<VerifiedInstitution> {
    return this.verifiedInstitutionsRepository.findOneBy({ id })
  }

  async remove(id: number): Promise<void> {
    await this.verifiedInstitutionsRepository.delete(id)
  }
}
