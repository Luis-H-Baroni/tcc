import { Test, TestingModule } from '@nestjs/testing'
import { BlockchainService } from 'src/modules/blockchain/blockchain.service'

const mockContract = {
  storeRecord: {
    populateTransaction: jest.fn(),
  },
  getRecords: jest.fn(),
}

const mockWallet = {
  signTransaction: jest.fn(),
}

const mockProvider = {
  broadcastTransaction: jest.fn(),
}

describe('BlockchainService', () => {
  let service: BlockchainService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockchainService,
        { provide: 'ETHERS_PROVIDER', useValue: mockProvider },
        {
          provide: 'ETHERS_CONTRACT',
          useValue: mockContract,
        },
        { provide: 'ETHERS_WALLET', useValue: mockWallet },
        { provide: 'ETHERS_INTERFACE', useValue: {} },
      ],
    }).compile()

    service = module.get<BlockchainService>(BlockchainService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('executeContractMethod', () => {
    it('should execute the contract method', async () => {
      const contractMethod = 'getRecords'
      const contractArgs = { documentHash: 'mockedDocumentHash' }
      const mockResult = 'mockedResult' as any

      mockContract.getRecords.mockReturnValue(mockResult)

      const result = await service.executeContractMethod(contractMethod, contractArgs)

      expect(result).toBe(mockResult)
    })

    it('should throw an error', async () => {
      const mockMethod = 'getRecords'
      const mockArgs = { arg1: 'mockedArg1' }
      const mockError = new Error('mockedError')

      mockContract.getRecords.mockRejectedValue(mockError)

      try {
        await service.executeContractMethod(mockMethod, mockArgs)
      } catch (error) {
        expect(error).toBe(mockError)
      }
    })
  })

  describe('buildContractTransaction', () => {
    it('should build the contract transaction', async () => {
      const contractMethod = 'storeRecord'
      const contractArgs = {
        documentHash: 'mockedDocumentHash',
        publicKey: 'mockedPublicKey',
      }
      const mockResult = 'mockedResult' as any

      mockContract.storeRecord.populateTransaction.mockReturnValue(mockResult)

      const result = await service.buildContractTransaction(contractMethod, contractArgs)

      expect(result).toBe(mockResult)
      expect(mockContract.storeRecord.populateTransaction).toHaveBeenCalledWith(
        ...Object.values(contractArgs),
      )
    })

    it('should throw an error', async () => {
      const mockMethod = 'storeRecord'
      const mockArgs = { arg1: 'mockedArg1' }
      const mockError = new Error('mockedError')

      mockContract.storeRecord.populateTransaction.mockRejectedValue(mockError)

      try {
        await service.buildContractTransaction(mockMethod, mockArgs)
      } catch (error) {
        expect(error).toBe(mockError)
      }
    })
  })

  describe('broadcastTransaction', () => {
    it('should broadcast the transaction', async () => {
      const mockTransaction = 'mockedTransaction'
      const mockResult = 'mockedResult' as any

      mockProvider.broadcastTransaction.mockReturnValue(mockResult)

      const result = await service.broadcastTransaction(mockTransaction)

      expect(result).toBe(mockResult)
      expect(mockProvider.broadcastTransaction).toHaveBeenCalledWith(mockTransaction)
    })

    it('should throw an error', async () => {
      const mockTransaction = 'mockedTransaction'
      const mockError = new Error('mockedError')

      mockProvider.broadcastTransaction.mockRejectedValue(mockError)

      try {
        await service.broadcastTransaction(mockTransaction)
      } catch (error) {
        expect(error).toBe(mockError)
      }
    })
  })
})
