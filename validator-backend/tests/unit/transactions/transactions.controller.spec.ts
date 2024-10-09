import { Test, TestingModule } from '@nestjs/testing'
import { TransactionsController } from 'src/transactions/transactions.controller'
import { TransactionsService } from 'src/transactions/transactions.service'
import { MecDigitalDiplomaService } from 'src/mec-digital-diploma/mec-digital-diploma.service'
import { BlockchainService } from 'src/blockchain/blockchain.service'
import { ConfigService } from '@nestjs/config'

describe('TransactionController', () => {
  let transactionController: TransactionsController
  let transactionService: TransactionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        MecDigitalDiplomaService,
        ConfigService,
        BlockchainService,
        { provide: 'ETHERS_PROVIDER', useValue: {} },
        { provide: 'ETHERS_CONTRACT', useValue: {} },
        { provide: 'ETHERS_WALLET', useValue: {} },
      ],
    }).compile()

    transactionController = module.get<TransactionsController>(TransactionsController)
    transactionService = module.get<TransactionsService>(TransactionsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(transactionController).toBeDefined()
  })

  describe('buildContractTransaction', () => {
    it('should build the transaction', async () => {
      const mockSignedTransaction = 'mockedSignedTransaction'
      const file = 'mockedFile'

      transactionService.buildContractTransaction = jest
        .fn()
        .mockResolvedValue(mockSignedTransaction)

      const result = await transactionController.buildContractTransaction(
        {
          publicKey: 'mockedPublicKey',
          documentHash: 'mockedDocumentHash',
          contractMethod: 'storeHash',
          validateDigitalDiploma: 'true',
          status: 0,
        },
        file,
      )

      expect(result).toBe(mockSignedTransaction)
      expect(transactionService.buildContractTransaction).toHaveBeenCalledWith(
        'mockedPublicKey',
        'mockedDocumentHash',
        'storeHash',
        'true',
        0,
        'mockedFile',
      )
    })

    it('should throw an error', async () => {
      const error = new Error('mockedBuildError')
      jest.spyOn(transactionService, 'buildContractTransaction').mockRejectedValue(error)

      await expect(
        transactionController.buildContractTransaction(
          {
            publicKey: 'mockedPublicKey',
            documentHash: 'mockedDocumentHash',
            contractMethod: 'storeHash',
            validateDigitalDiploma: 'true',
            status: 0,
          },
          'mockedFile',
        ),
      ).rejects.toThrow(error)
    })
  })

  describe('broadcastContractTransaction', () => {
    it('should broadcast the transaction', async () => {
      const mockTransactionReceipt = {
        hash: 'mockedHash',
      }

      transactionService.broadcastContractTransaction = jest
        .fn()
        .mockResolvedValue(mockTransactionReceipt)

      const result = await transactionController.broadcastContractTransaction({
        transaction: 'mockedTransaction',
        documentHash: 'mockedDocumentHash',
      })
      expect(result).toContain('mockedDocumentHash')
      expect(result).toContain(mockTransactionReceipt.hash)
      expect(transactionService.broadcastContractTransaction).toHaveBeenCalledWith(
        'mockedTransaction',
      )
    })

    it('should throw an error', async () => {
      const error = new Error('mockedBroadcastError')
      jest
        .spyOn(transactionService, 'broadcastContractTransaction')
        .mockRejectedValue(error)

      await expect(
        transactionController.broadcastContractTransaction({
          transaction: 'mockedTransaction',
          documentHash: 'mockedDocumentHash',
        }),
      ).rejects.toThrow(error)
    })
  })
})
