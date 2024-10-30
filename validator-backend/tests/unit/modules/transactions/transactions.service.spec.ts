import { Test, TestingModule } from '@nestjs/testing'
import { TransactionsService } from 'src/modules/transactions/transactions.service'
import { ServiceUnavailableException } from '@nestjs/common'
import { MecConformityStatus, Status } from 'src/enums'
import { ethers } from 'ethers'
import { ConfigService } from '@nestjs/config'
import { BlockchainService } from 'src/modules/blockchain/blockchain.service'
import { MecDigitalDiplomaService } from 'src/modules/mec-digital-diploma/mec-digital-diploma.service'
import contractArtifact from '../../../../artifacts/contracts/Validator.sol/Validator.json'

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
        {
          provide: 'ETHERS_INTERFACE',
          useFactory: () => {
            return new ethers.Interface(contractArtifact.abi)
          },
        },
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
          hashedPublicKey: ethers.id(mockPublicKey),
          mecConformityStatus: MecConformityStatus.VALID,
        },
      )
    })

    it('should return a contract transaction without MEC conformity status', async () => {
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
          hashedPublicKey: ethers.id(mockPublicKey),
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
          hashedPublicKey: ethers.id(mockPublicKey),
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
    const mockedValidSignedTransaction =
      '0x02f8d3818903850697f1fd1285076e5d3b2083026fab94af61be2ab13239dacc683f6a42297c1629769ab680b8648d15d1d1cdc49619d06e1d3d6faa0c63df43782e22305af03fb17e219cb42a3dd4ce14619007f2fed5d901b1674c0c61835be406fb2e76f82c0d0aea2a444de00b2f1d510000000000000000000000000000000000000000000000000000000000000003c080a03e4ed8b5e869019e7bfc706e877c373cc0d1d319300adc16ae9f888c4572a876a0696be16bd152b2b3fe20674fb7650e85c7cc325d3738596d056cafd9948ca244'
    const mockedSignedTransactionWithDifferentPublicKey =
      '0x02f8d381890485072bcef4b48507703e780a83026fab94af61be2ab13239dacc683f6a42297c1629769ab680b8648d15d1d1cdc49619d06e1d3d6faa0c63df43782e22305af03fb17e219cb42a3dd4ce14619007f2fed5d901b1674c0c61835be406fb2e76f82c0d0aea2a444de00b2f1d510000000000000000000000000000000000000000000000000000000000000003c080a0877c5499ac1eac5c04e2abf387555fc26ea34b371d586e166c83c91f1e00dae6a014bab757902279583669737906ebf6147902b7d891028bc0d3fa1548864055f0'

    it('should broadcast the transaction', async () => {
      jest.spyOn(blockchainService, 'broadcastTransaction').mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: 'hash', status: 1 }),
      } as any)

      const result = await transactionService.broadcastContractTransaction(
        mockedValidSignedTransaction,
      )
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
        transactionService.broadcastContractTransaction(mockedValidSignedTransaction),
      ).rejects.toThrow(ServiceUnavailableException)
    })

    it('should throw BadRequestException on public key mismatch', async () => {
      await expect(
        transactionService.broadcastContractTransaction(
          mockedSignedTransactionWithDifferentPublicKey,
        ),
      ).rejects.toThrow('Public key does not match')
    })

    it('should not throw on public key mismatch for other contract methods', async () => {
      jest.spyOn(blockchainService, 'decodeContractTransactionData').mockResolvedValue({
        name: 'otherMethod',
      } as any)

      jest.spyOn(blockchainService, 'broadcastTransaction').mockResolvedValue({
        wait: jest.fn().mockResolvedValue({ hash: 'hash', status: 1 }),
      } as any)

      await expect(
        transactionService.broadcastContractTransaction(
          mockedSignedTransactionWithDifferentPublicKey,
        ),
      ).resolves.not.toThrow()
    })
  })

  describe('verifySenderPublicKey', () => {
    const mockedSignedTransaction =
      '0x02f8d3818903850697f1fd1285076e5d3b2083026fab94af61be2ab13239dacc683f6a42297c1629769ab680b8648d15d1d1cdc49619d06e1d3d6faa0c63df43782e22305af03fb17e219cb42a3dd4ce14619007f2fed5d901b1674c0c61835be406fb2e76f82c0d0aea2a444de00b2f1d510000000000000000000000000000000000000000000000000000000000000003c080a03e4ed8b5e869019e7bfc706e877c373cc0d1d319300adc16ae9f888c4572a876a0696be16bd152b2b3fe20674fb7650e85c7cc325d3738596d056cafd9948ca244'
    const publicKey =
      '0x041797504339810d9d62c8cb0b9094567fcdb569be5fcb7c86999c8994e9d7bc1a3cfc5d80cef3ea6fd0fe38b5fc4298b8b3feb774b3d66ce0030a195eaed65070'

    it('should return true on matching public keys', async () => {
      const result = await transactionService.verifySenderPublicKey(
        publicKey,
        mockedSignedTransaction,
      )
      expect(result).toBe(true)
    })

    it('should return false on mismatching public keys', async () => {
      const result = await transactionService.verifySenderPublicKey(
        '0x1234567890123456789012345678901234567890123456789012345678901234',
        mockedSignedTransaction,
      )

      expect(result).toBe(false)
    })
  })
})
