import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateVerifiedInstitutionDto } from 'src/dtos/create-verified-institution.dto'
import { VerifiedInstitutionsService } from 'src/modules/verified-institutions/verified-institutions.service'
import { VerifiedInstitution } from 'src/modules/verified-institutions/verified-institutions.entity'

describe('VerifiedInstitutionsService', () => {
  let service: VerifiedInstitutionsService
  let repository: Repository<VerifiedInstitution>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifiedInstitutionsService,
        {
          provide: getRepositoryToken(VerifiedInstitution),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<VerifiedInstitutionsService>(VerifiedInstitutionsService)
    repository = module.get<Repository<VerifiedInstitution>>(
      getRepositoryToken(VerifiedInstitution),
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('create', () => {
    it('should create a new verified institution', async () => {
      const verifiedInstitutionDto: CreateVerifiedInstitutionDto = {
        name: 'Test Institution',
        verified: true,
      }
      const savedVerifiedInstitution: VerifiedInstitution = {
        id: 1,
        name: 'Test Institution',
        abbreviation: 'TI',
        publicKey: '0x1234567890',
        address: 'Diliman, Quezon City',
        email: ' [email protected]',
        phone: '1234567890',
        website: 'https://testinstitution.com',
        representative: 'Juan Dela Cruz',
        representativeEmail: ' [email protected]',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      jest.spyOn(repository, 'save').mockResolvedValue(savedVerifiedInstitution)

      const result = await service.create(verifiedInstitutionDto)

      expect(repository.save).toHaveBeenCalledWith({
        ...verifiedInstitutionDto,
        verified: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
      expect(result).toEqual(savedVerifiedInstitution)
    })
  })

  describe('update', () => {
    it('should update an existing verified institution', async () => {
      const id = 1
      const verifiedInstitutionDto: CreateVerifiedInstitutionDto = {
        name: 'Updated Institution',
        verified: true,
      }
      const updatedVerifiedInstitution: VerifiedInstitution = {
        id: 1,
        name: 'Updated Institution',
        abbreviation: 'TI',
        publicKey: '0x1234567890',
        address: 'Diliman, Quezon City',
        email: ' [email protected]',
        phone: '1234567890',
        website: 'https://testinstitution.com',
        representative: 'Juan Dela Cruz',
        representativeEmail: ' [email protected]',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      jest.spyOn(repository, 'save').mockResolvedValue(updatedVerifiedInstitution)

      const result = await service.update(id, verifiedInstitutionDto)

      expect(repository.save).toHaveBeenCalledWith({
        id,
        ...verifiedInstitutionDto,
        updatedAt: expect.any(Date),
        verified: true,
      })
      expect(result).toEqual(updatedVerifiedInstitution)
    })
  })

  describe('findAll', () => {
    it('should return all verified institutions', async () => {
      const verifiedInstitutions: VerifiedInstitution[] = [
        {
          id: 1,
          name: 'Updated Institution',
          abbreviation: 'TI',
          publicKey: '0x1234567890',
          address: 'Diliman, Quezon City',
          email: ' [email protected]',
          phone: '1234567890',
          website: 'https://testinstitution.com',
          representative: 'Juan Dela Cruz',
          representativeEmail: ' [email protected]',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Test Institution',
          abbreviation: 'TI',
          publicKey: '0x1234567890',
          address: 'Diliman, Quezon City',
          email: ' [email protected]',
          phone: '1234567890',
          website: 'https://testinstitution.com',
          representative: 'Juan Dela Cruz',
          representativeEmail: ' [email protected]',
          verified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      jest.spyOn(repository, 'find').mockResolvedValue(verifiedInstitutions)

      const result = await service.findAll()

      expect(repository.find).toHaveBeenCalled()
      expect(result).toEqual(verifiedInstitutions)
    })
  })

  describe('findAllVerified', () => {
    it('should return all verified institutions', async () => {
      const verifiedInstitutions: VerifiedInstitution[] = [
        {
          id: 1,
          name: 'Updated Institution',
          abbreviation: 'TI',
          publicKey: '0x1234567890',
          address: 'Diliman, Quezon City',
          email: ' [email protected]',
          phone: '1234567890',
          website: 'https://testinstitution.com',
          representative: 'Juan Dela Cruz',
          representativeEmail: ' [email protected]',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Test Institution',
          abbreviation: 'TI',
          publicKey: '0x1234567890',
          address: 'Diliman, Quezon City',
          email: ' [email protected]',
          phone: '1234567890',
          website: 'https://testinstitution.com',
          representative: 'Juan Dela Cruz',
          representativeEmail: ' [email protected]',
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      jest.spyOn(repository, 'findBy').mockResolvedValue(verifiedInstitutions)

      const result = await service.findAllVerified()

      expect(repository.findBy).toHaveBeenCalledWith({ verified: true })
      expect(result).toEqual(verifiedInstitutions)
    })
  })

  describe('findOne', () => {
    it('should return a verified institution by id', async () => {
      const id = 1
      const verifiedInstitution: VerifiedInstitution = {
        id: 2,
        name: 'Test Institution',
        abbreviation: 'TI',
        publicKey: '0x1234567890',
        address: 'Diliman, Quezon City',
        email: ' [email protected]',
        phone: '1234567890',
        website: 'https://testinstitution.com',
        representative: 'Juan Dela Cruz',
        representativeEmail: ' [email protected]',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(verifiedInstitution)

      const result = await service.findOne(id)

      expect(repository.findOneBy).toHaveBeenCalledWith({ id })
      expect(result).toEqual(verifiedInstitution)
    })
  })

  describe('remove', () => {
    it('should remove a verified institution by id', async () => {
      const id = 1

      jest.spyOn(repository, 'delete').mockResolvedValue(undefined)

      await service.remove(id)

      expect(repository.delete).toHaveBeenCalledWith(id)
    })
  })

  describe('parseBooleanIfString', () => {
    it('should parse a boolean value if it is a string', () => {
      const result = service.parseBooleanIfString('true')
      expect(result).toBe(true)
    })

    it('should return the boolean value if it is not a string', () => {
      const result = service.parseBooleanIfString(true)
      expect(result).toBe(true)
    })
  })
})
