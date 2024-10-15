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
    const updatedAt = new Date()
    return await this.verifiedInstitutionsRepository.save({
      ...verifiedInstitution,
      createdAt,
      updatedAt,
    })
  }

  async update(
    id: number,
    verifiedInstitution: CreateVerifiedInstitutionDto,
  ): Promise<VerifiedInstitution> {
    const numberId = Number(id)
    const updatedAt = new Date()
    const verified = this.parseBoolean(verifiedInstitution.verified)
    const updatedInstitution = {
      id: numberId,
      ...verifiedInstitution,
      updatedAt,
      verified,
    }
    return await this.verifiedInstitutionsRepository.save(updatedInstitution)
  }

  async findAll(): Promise<VerifiedInstitution[]> {
    return await this.verifiedInstitutionsRepository.find()
  }

  async findOne(id: number): Promise<VerifiedInstitution> {
    return await this.verifiedInstitutionsRepository.findOneBy({ id })
  }

  async remove(id: number): Promise<void> {
    await this.verifiedInstitutionsRepository.delete(id)
  }

  parseBoolean(value: string | boolean): boolean {
    if (typeof value === 'boolean') return value
    return value === 'true'
  }
}
