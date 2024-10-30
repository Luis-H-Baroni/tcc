import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { CreateVerifiedInstitutionDto } from 'src/dtos/create-verified-institution.dto'
import { AuthGuard } from 'src/modules/auth/auth.guard'
import { VerifiedInstitutionsController } from 'src/modules/verified-institutions/verified-institutions.controller'
import { VerifiedInstitution } from 'src/modules/verified-institutions/verified-institutions.entity'
import { VerifiedInstitutionsService } from 'src/modules/verified-institutions/verified-institutions.service'
import { Repository } from 'typeorm'

describe('VerifiedInstitutionsController', () => {
  let controller: VerifiedInstitutionsController
  let service: VerifiedInstitutionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifiedInstitutionsController],
      providers: [
        VerifiedInstitutionsService,
        AuthGuard,
        ConfigService,
        JwtService,
        {
          provide: getRepositoryToken(VerifiedInstitution),
          useClass: Repository,
        },
      ],
    }).compile()

    controller = module.get<VerifiedInstitutionsController>(
      VerifiedInstitutionsController,
    )
    service = module.get<VerifiedInstitutionsService>(VerifiedInstitutionsService)
  })

  describe('create', () => {
    const mockPayload: CreateVerifiedInstitutionDto = {
      abbreviation: 'UP',
      publicKey: '0x1234567890',
      name: 'University of the Philippines',
      address: 'Diliman, Quezon City',
      email: ' [email protected]',
      phone: '1234567890',
      website: 'https://up.edu.ph',
      representative: 'Juan Dela Cruz',
      representativeEmail: ' [email protected]',
      verified: true,
    }
    const mockResponse = {
      id: 1,
      abbreviation: 'UP',
      publicKey: '0x1234567890',
      name: 'University of the Philippines',
      address: 'Diliman, Quezon City',
      email: ' [email protected]',
      phone: '1234567890',
      website: 'https://up.edu.ph',
      representative: 'Juan Dela Cruz',
      representativeEmail: ' [email protected]',
      verified: false,
      createdAt: new Date('2021-10-01T00:00:00.000Z'),
      updatedAt: new Date('2021-10-01T00:00:00.000Z'),
    }
    it('should create a verified institution', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockResponse)

      const result = await controller.create(mockPayload)

      expect(service.create).toHaveBeenCalledWith(mockPayload)
      expect(result).toContain(`
    <div class="alert alert-success" role="alert">
      Pedido de verificação da instituição ${mockResponse.abbreviation} enviado com sucesso!
    </div>`)
    })
  })

  describe('update', () => {
    const mockPayload = {
      verified: true,
    }
    const mockResponse = {
      id: 1,
      abbreviation: 'UP',
      publicKey: '0x1234567890',
      name: 'University of the Philippines',
      address: 'Diliman, Quezon City',
      email: ' [email protected]',
      phone: '1234567890',
      website: 'https://up.edu.ph',
      representative: 'Juan Dela Cruz',
      representativeEmail: ' [email protected]',
      verified: true,
      createdAt: new Date('2021-10-01T00:00:00.000Z'),
      updatedAt: new Date('2021-10-01T00:00:00.000Z'),
    }
    it('should update a verified institution', async () => {
      const id = 1

      jest.spyOn(service, 'update').mockResolvedValue(mockResponse)

      const result = await controller.update(id, mockPayload)

      expect(service.update).toHaveBeenCalledWith(id, mockPayload)
      expect(result).toContain(mockResponse.abbreviation)
      expect(result).toContain(mockResponse.name)
      expect(result).toContain(mockResponse.address)
      expect(result).toContain(mockResponse.email)
      expect(result).toContain(mockResponse.phone)
      expect(result).toContain(mockResponse.website)
      expect(result).toContain(mockResponse.representative)
      expect(result).toContain(mockResponse.representativeEmail)
    })
  })

  describe('getVerifiedInstitutions', () => {
    it('should get all verified institutions', async () => {
      const verifiedInstitutions = [
        {
          id: 1,
          abbreviation: 'UP',
          publicKey: '0x123456',
          name: 'University of the Philippines',
          address: 'Diliman, Quezon City',
          email: ' [email protected]',
          phone: '1234567890',
          website: 'https://up.edu.ph',
          representative: 'Juan Dela Cruz',
          representativeEmail: ' [email protected]',
          verified: true,
          createdAt: new Date('2021-10-01T00:00:00.000Z'),
          updatedAt: new Date('2021-10-01T00:00:00.000Z'),
        },
      ]

      jest.spyOn(service, 'findAllVerified').mockResolvedValue(verifiedInstitutions)

      const result = await controller.getVerifiedInstitutions()

      expect(service.findAllVerified).toHaveBeenCalled()
      expect(result).toContain(verifiedInstitutions[0].abbreviation)
      expect(result).toContain(verifiedInstitutions[0].name)
      expect(result).toContain(verifiedInstitutions[0].address)
      expect(result).toContain(verifiedInstitutions[0].email)
      expect(result).toContain(verifiedInstitutions[0].phone)
      expect(result).toContain(verifiedInstitutions[0].website)
      expect(result).toContain(verifiedInstitutions[0].representative)
      expect(result).toContain(verifiedInstitutions[0].representativeEmail)
    })
  })

  describe('findOne', () => {
    it('should find a verified institution by ID', async () => {
      const id = 1
      const mockResponse = {
        id: 1,
        abbreviation: 'UP',
        publicKey: '0x1234567890',
        name: 'University of the Philippines',
        address: 'Diliman, Quezon City',
        email: ' [email protected]',
        phone: '1234567890',
        website: 'https://up.edu.ph',
        representative: 'Juan Dela Cruz',
        representativeEmail: ' [email protected]',
        verified: true,
        createdAt: new Date('2021-10-01T00:00:00.000Z'),
        updatedAt: new Date('2021-10-01T00:00:00.000Z'),
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(mockResponse)

      const result = await controller.findOne(id)

      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(result).toBe(mockResponse)
    })
  })

  describe('remove', () => {
    it('should remove a verified institution by ID', async () => {
      const id = 1

      jest.spyOn(service, 'remove').mockResolvedValue(undefined)

      await controller.remove(id)

      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})
