import { Test, TestingModule } from '@nestjs/testing'
import { TransactionController } from '../../../src/transactions/transactions.controller'
import { TransactionService } from '../../../src/transactions/transactions.service'

describe('TransactionController', () => {
  let transactionController: TransactionController
  let transactionService: TransactionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            buildContractTransaction: jest.fn(),
            broadcastContractTransaction: jest.fn(),
          },
        },
      ],
    }).compile()

    transactionController = module.get<TransactionController>(TransactionController)
    transactionService = module.get<TransactionService>(TransactionService)
  })

  it('should be defined', () => {
    expect(transactionController).toBeDefined()
  })

  describe('buildContractTransaction', () => {
    it('should build the transaction', async () => {
      const mockSignedTransaction = 'mockedSignedTransaction'

      transactionService.buildContractTransaction = jest
        .fn()
        .mockResolvedValue(mockSignedTransaction)

      const result = await transactionController.buildContractTransaction({
        publicKey: 'mockedPublicKey',
        documentHash: 'mockedDocumentHash',
        contractMethod: 'storeHash',
      })
      expect(result).toBe(mockSignedTransaction)
      expect(transactionService.buildContractTransaction).toHaveBeenCalledWith(
        'mockedPublicKey',
        'mockedDocumentHash',
        'storeHash',
      )
    })
  })

  describe('broadcastContractTransaction', () => {
    it('should broadcast the transaction', async () => {
      const mockBroadcastResult = 'mockedBroadcastResult'

      transactionService.broadcastContractTransaction = jest
        .fn()
        .mockResolvedValue(mockBroadcastResult)

      const result = await transactionController.broadcastContractTransaction({
        transaction: 'mockedTransaction',
      })
      expect(result).toBe(mockBroadcastResult)
      expect(transactionService.broadcastContractTransaction).toHaveBeenCalledWith(
        'mockedTransaction',
      )
    })
  })
})
