import { Test, TestingModule } from '@nestjs/testing'
import { RecordsService } from 'src/records/records.service'
import { BlockchainService } from 'src/blockchain/blockchain.service'
import { ConfigService } from '@nestjs/config'
import { ethers } from 'ethers'

describe('RecordsService', () => {
  let service: RecordsService
  let blockchainService: BlockchainService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockchainService,
        RecordsService,
        ConfigService,
        { provide: 'ETHERS_PROVIDER', useValue: {} },
        { provide: 'ETHERS_CONTRACT', useValue: {} },
        { provide: 'ETHERS_WALLET', useValue: {} },
      ],
    }).compile()

    service = module.get<RecordsService>(RecordsService)
    blockchainService = module.get<BlockchainService>(BlockchainService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getRecords', () => {
    it('should return a record', async () => {
      const contractMethod = 'getRecords'
      const mockRecords = [
        {
          hash: 'mockedHash',
          exists: true,
          publicKey: 'mockKey',
          status: 0n,
          mecConformityStatus: 0n,
        },
      ]
      const documentHash = 'mockedDocumentHash'

      jest
        .spyOn(blockchainService, 'executeContractMethod')
        .mockResolvedValue(mockRecords)

      const result = await service.getRecords(documentHash)

      expect(blockchainService.executeContractMethod).toHaveBeenCalledWith(
        contractMethod,
        { documentHash },
      )
      expect(result).toBe(mockRecords)
    })

    it('should return a record not found', async () => {
      const mockRecords = []
      const documentHash = 'mockedDocumentHash'

      jest
        .spyOn(blockchainService, 'executeContractMethod')
        .mockResolvedValue(mockRecords)

      const result = await service.getRecords(documentHash)

      expect(blockchainService.executeContractMethod).toHaveBeenCalledWith('getRecords', {
        documentHash,
      })
      expect(result).toBe(mockRecords)
    })

    it('should throw an error', async () => {
      const documentHash = 'mockedDocumentHash'

      jest
        .spyOn(blockchainService, 'executeContractMethod')
        .mockRejectedValue(new Error('Error'))

      await expect(service.getRecords(documentHash)).rejects.toThrowError('Error')
    })
  })

  describe('verifyOwnership', () => {
    it('should return true', async () => {
      const mockPublicKey =
        '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5'
      const mockDocumentHash =
        '0x1234567890123455589012345678901234567890123456789012345678901234'
      const hashedPublicKey = ethers.keccak256(mockPublicKey)
      const mockRecords = [
        {
          hash: 'mockedHash',
          exists: true,
          publicKey: hashedPublicKey,
          status: 0n,
          mecConformityStatus: 0n,
        },
      ]

      jest.spyOn(service, 'getRecords').mockResolvedValue(mockRecords)

      const result = await service.verifyOwnership(mockDocumentHash, mockPublicKey)

      expect(service.getRecords).toHaveBeenCalledWith(mockDocumentHash)
      expect(result).toBe(true)
    })

    it('should return false', async () => {
      const mockPublicKey =
        '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5'
      const mockDocumentHash =
        '0x1234567890123455589012345678901234567890123456789012345678901234'

      const mockRecords = [
        {
          hash: 'mockedHash',
          exists: true,
          publicKey: 'anotherHashedPublicKey',
          status: 0n,
          mecConformityStatus: 0n,
        },
      ]

      jest.spyOn(service, 'getRecords').mockResolvedValue(mockRecords)

      const result = await service.verifyOwnership(mockDocumentHash, mockPublicKey)

      expect(service.getRecords).toHaveBeenCalledWith(mockDocumentHash)
      expect(result).toBe(false)
    })
  })
})
