import { Test, TestingModule } from '@nestjs/testing'

import { TransactionsService } from '../../../src/transactions/transactions.service'
import { InternalServerErrorException } from '@nestjs/common'
import { ethers } from 'ethers'
import { ConfigService } from '@nestjs/config'

const mockProvider = {
  broadcastTransaction: jest.fn(),
}

const mockWallet = {
  signingKey: { publicKey: 'mockedPublicKey' },
  populateTransaction: jest.fn(),
  signTransaction: jest.fn(),
}

const mockContract = {
  storeHash: {
    populateTransaction: jest.fn(),
  },
}

describe('TransactionService', () => {
  let transactionService: TransactionService
  let configService: ConfigService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        TransactionService,
        ConfigService,
        { provide: 'ETHERS_PROVIDER', useValue: mockProvider },
        { provide: 'ETHERS_WALLET', useValue: mockWallet },
        { provide: 'ETHERS_CONTRACT', useValue: mockContract },
      ],
    }).compile()

    transactionService = app.get<TransactionService>(TransactionService)
    configService = app.get<ConfigService>(ConfigService)
  })

  describe('buildContractTransaction', () => {
    const mockPublicKey =
      '0x048318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5'
    const mockDocumentHash =
      '0x1234567890123455589012345678901234567890123456789012345678901234'
    const validMethods = ['storeHash']
    const contractMethod = 'storeHash'

    it('should return signed transaction of a valid module', async () => {
      const mockTransaction = { mock: 'transaction' }
      const mockSignedTransaction = 'mockedSignedTransaction'

      jest.spyOn(configService, 'get').mockReturnValue(validMethods)

      mockContract.storeHash.populateTransaction.mockResolvedValue(mockTransaction)
      mockWallet.populateTransaction.mockResolvedValue(mockTransaction)
      mockWallet.signTransaction.mockResolvedValue(mockSignedTransaction)

      const result = await transactionService.buildContractTransaction(
        mockPublicKey,
        mockDocumentHash,
        contractMethod,
      )
      expect(result).toBe(mockSignedTransaction)
      expect(configService.get).toHaveBeenCalledWith('contract.methods')

      expect(mockContract.storeHash.populateTransaction).toHaveBeenCalledWith(
        mockDocumentHash,
        ethers.keccak256(mockPublicKey),
      )
      expect(mockWallet.populateTransaction).toHaveBeenCalledWith(mockTransaction)
      expect(mockWallet.signTransaction).toHaveBeenCalledWith(mockTransaction)
    })

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(configService, 'get').mockReturnValue(validMethods)

      mockContract.storeHash.populateTransaction.mockRejectedValue(
        new Error('Mocked Error'),
      )

      await expect(
        transactionService.buildContractTransaction(
          mockPublicKey,
          mockDocumentHash,
          contractMethod,
        ),
      ).rejects.toThrow(InternalServerErrorException)
    })

    it('should throw BadRequestException on invalid contract method', async () => {
      jest.spyOn(configService, 'get').mockReturnValue(validMethods)

      await expect(
        transactionService.buildContractTransaction(
          mockPublicKey,
          mockDocumentHash,
          'invalidMethod',
        ),
      ).rejects.toThrow('Invalid contract method')
    })
  })

  describe('broadcastContractTransaction', () => {
    it('should broadcast the transaction', async () => {
      const mockBroadcastResult = 'mockedBroadcastResult'

      mockProvider.broadcastTransaction.mockResolvedValue(mockBroadcastResult)

      const result =
        await transactionService.broadcastContractTransaction('mockedTransaction')
      expect(result).toBe(mockBroadcastResult)
      expect(mockProvider.broadcastTransaction).toHaveBeenCalledWith('mockedTransaction')
    })

    it('should throw InternalServerErrorException on error', async () => {
      mockProvider.broadcastTransaction.mockRejectedValue(new Error('Mocked Error'))

      await expect(
        transactionService.broadcastContractTransaction('mockedTransaction'),
      ).rejects.toThrow(InternalServerErrorException)
    })
  })
})
