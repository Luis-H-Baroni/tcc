import { Test, TestingModule } from '@nestjs/testing'
import { TransactionsController } from 'src/modules/transactions/transactions.controller'
import { TransactionsService } from 'src/modules/transactions/transactions.service'
import { MecDigitalDiplomaService } from 'src/modules/mec-digital-diploma/mec-digital-diploma.service'
import { BlockchainService } from 'src/modules/blockchain/blockchain.service'
import { ConfigService } from '@nestjs/config'
import { ethers } from 'ethers'

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
        { provide: 'ETHERS_INTERFACE', useValue: {} },
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

    it('should catch and throw an error', async () => {
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

    it('should return insufficient funds template when ethers error is insufficient funds', async () => {
      const error = ethers.makeError('insufficient funds', 'INSUFFICIENT_FUNDS')
      jest
        .spyOn(transactionService, 'broadcastContractTransaction')
        .mockRejectedValue(error)

      const result = await transactionController.broadcastContractTransaction({
        transaction: 'mockedTransaction',
        documentHash: 'mockedDocumentHash',
      })

      expect(result).toContain('<p>Saldo insuficiente</p>')
      expect(result).toContain(
        '<p>A carteira não possui saldo suficiente para realizar a transação.</p>',
      )
    })
  })
})
