import { Test, TestingModule } from '@nestjs/testing'
import { TransactionsService } from 'src/transactions/transactions.service'
import { ServiceUnavailableException } from '@nestjs/common'
import { MecConformityStatus, Status } from 'src/enums'
import { ethers } from 'ethers'
import { ConfigService } from '@nestjs/config'
import { BlockchainService } from 'src/blockchain/blockchain.service'
import { MecDigitalDiplomaService } from 'src/mec-digital-diploma/mec-digital-diploma.service'

describe('TransactionService', () => {
  let transactionService: TransactionsService
  let configService: ConfigService
  let blockchainService: BlockchainService
  let mecDigitalDiplomaService: MecDigitalDiplomaService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        BlockchainService,
        MecDigitalDiplomaService,
        TransactionsService,
        ConfigService,
        { provide: 'ETHERS_PROVIDER', useValue: {} },
        { provide: 'ETHERS_CONTRACT', useValue: {} },
        { provide: 'ETHERS_WALLET', useValue: {} },
      ],
    }).compile()

    transactionService = app.get<TransactionsService>(TransactionsService)
    configService = app.get<ConfigService>(ConfigService)
    blockchainService = app.get<BlockchainService>(BlockchainService)
    mecDigitalDiplomaService = app.get<MecDigitalDiplomaService>(MecDigitalDiplomaService)
  })

  describe('buildContractTransaction', () => {
    const mockPublicKey =
      '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5'
    const mockDocumentHash =
      '0x1234567890123455589012345678901234567890123456789012345678901234'
    const validMethods = ['storeRecord']
    const contractMethod = 'storeRecord'

    it('should return a contract transaction', async () => {
      const mockFile = {
        buffer: 'mockedBuffer',
        originalname: 'mockedFile',
      }
      const mockTransaction = {
        mock: 'transaction',
      } as unknown as ethers.ContractTransaction

      const validateDigitalDiploma = 'true'

      jest.spyOn(configService, 'get').mockReturnValue(validMethods)

      jest
        .spyOn(blockchainService, 'buildContractTransaction')
        .mockResolvedValue(mockTransaction)

      jest.spyOn(mecDigitalDiplomaService, 'verifyDiploma').mockResolvedValue({
        status: 'VALID',
      } as any)

      const result = await transactionService.buildContractTransaction(
        mockPublicKey,
        mockDocumentHash,
        contractMethod,
        validateDigitalDiploma,
        Status.VALID,
        mockFile,
      )
      expect(result).toBe(mockTransaction)
      expect(configService.get).toHaveBeenCalledWith('contract.methods')
      expect(blockchainService.buildContractTransaction).toHaveBeenCalledWith(
        contractMethod,
        {
          documentHash: mockDocumentHash,
          hashedPublicKey: ethers.keccak256(mockPublicKey),
          mecConformityStatus: MecConformityStatus.VALID,
        },
      )
    })

    it('should return a contract transaction without MEC conformity status', async () => {
      const mockFile = {
        buffer: 'mockedBuffer',
        originalname: 'mockedFile',
      }
      const mockTransaction = {
        mock: 'transaction',
      } as unknown as ethers.ContractTransaction

      const validateDigitalDiploma = 'false'

      jest.spyOn(configService, 'get').mockReturnValue(validMethods)

      jest
        .spyOn(blockchainService, 'buildContractTransaction')
        .mockResolvedValue(mockTransaction)

      const result = await transactionService.buildContractTransaction(
        mockPublicKey,
        mockDocumentHash,
        contractMethod,
        validateDigitalDiploma,
      )
      expect(result).toBe(mockTransaction)
      expect(configService.get).toHaveBeenCalledWith('contract.methods')
      expect(blockchainService.buildContractTransaction).toHaveBeenCalledWith(
        contractMethod,
        {
          documentHash: mockDocumentHash,
          hashedPublicKey: ethers.keccak256(mockPublicKey),
          mecConformityStatus: MecConformityStatus.NULL,
        },
      )
    })

    it('should build the transaction with status (invalid)', async () => {
      const contractMethod = 'updateRecordStatus'
      const mockFile = {
        buffer: 'mockedBuffer',
        originalname: 'mockedFile',
      }
      const mockTransaction = {
        mock: 'transaction',
      } as unknown as ethers.ContractTransaction

      const validateDigitalDiploma = 'true'

      jest.spyOn(configService, 'get').mockReturnValue(['updateRecordStatus'])

      jest
        .spyOn(blockchainService, 'buildContractTransaction')
        .mockResolvedValue(mockTransaction)

      jest.spyOn(mecDigitalDiplomaService, 'verifyDiploma').mockResolvedValue({
        status: 'VALID',
      } as any)

      const result = await transactionService.buildContractTransaction(
        mockPublicKey,
        mockDocumentHash,
        contractMethod,
        validateDigitalDiploma,
        Status.INVALID,
        mockFile,
      )
      expect(result).toBe(mockTransaction)
      expect(configService.get).toHaveBeenCalledWith('contract.methods')
      expect(blockchainService.buildContractTransaction).toHaveBeenCalledWith(
        contractMethod,
        {
          documentHash: mockDocumentHash,
          hashedPublicKey: ethers.keccak256(mockPublicKey),
          mecConformityStatus: MecConformityStatus.VALID,
          status: Status.INVALID,
        },
      )
    })

    it('should throw on error', async () => {
      const validateDigitalDiploma = 'false'
      jest.spyOn(configService, 'get').mockReturnValue(validMethods)

      jest
        .spyOn(blockchainService, 'buildContractTransaction')
        .mockRejectedValue(new Error('Mocked Error'))

      await expect(
        transactionService.buildContractTransaction(
          mockPublicKey,
          mockDocumentHash,
          contractMethod,
          validateDigitalDiploma,
        ),
      ).rejects.toThrow(Error)
    })

    it('should throw BadRequestException on invalid contract method', async () => {
      const validateDigitalDiploma = 'true'
      jest.spyOn(configService, 'get').mockReturnValue(validMethods)

      await expect(
        transactionService.buildContractTransaction(
          mockPublicKey,
          mockDocumentHash,
          'invalidMethod',
          validateDigitalDiploma,
        ),
      ).rejects.toThrow('Invalid contract method')
    })

    it('should throw error on invalid boolean value', async () => {
      const validateDigitalDiploma = 'invalidValue'
      jest.spyOn(configService, 'get').mockReturnValue(validMethods)

      await expect(
        transactionService.buildContractTransaction(
          mockPublicKey,
          mockDocumentHash,
          contractMethod,
          validateDigitalDiploma,
        ),
      ).rejects.toThrow('Invalid boolean value')
    })
  })

  describe('broadcastContractTransaction', () => {
    it('should broadcast the transaction', async () => {
      jest.spyOn(blockchainService, 'broadcastTransaction').mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: 'hash', status: 1 }),
      } as any)

      const result =
        await transactionService.broadcastContractTransaction('mockedTransaction')
      expect(result).toStrictEqual({ hash: 'hash', status: 1 })
    })

    it('should throw on error', async () => {
      jest
        .spyOn(blockchainService, 'broadcastTransaction')
        .mockRejectedValue(new Error('Mocked Error'))

      await expect(
        transactionService.broadcastContractTransaction('mockedTransaction'),
      ).rejects.toThrow(Error)
    })

    it('should throw ServiceUnavailableException on transaction failure', async () => {
      jest.spyOn(blockchainService, 'broadcastTransaction').mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: 'hash', status: 0 }),
      } as any)

      await expect(
        transactionService.broadcastContractTransaction('mockedTransaction'),
      ).rejects.toThrow(ServiceUnavailableException)
    })
  })
})
